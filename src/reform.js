/**
 * --------------------------------------------------------------------------------
 * Reform.js
 * --------------------------------------------------------------------------------
 * This extension provides an easy way to create and handle forms with a modern
 * approach in mind. Read more about here:
 * https://github.com/danielneubert/reform
 * --------------------------------------------------------------------------------
 * Code is written after the Airbnb JavaScript Style Guide
 * https://github.com/airbnb/javascript
 * --------------------------------------------------------------------------------
 * @author    Daniel Neubert <git@danielneubert.com>
 * @copyright 2018 Daniel Neubert
 * --------------------------------------------------------------------------------
 * @version   1.0.2
 * --------------------------------------------------------------------------------
 */

// prevent conflicts
;

(
  // check for dependency management libraries
  function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
      define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
      module.exports = factory(require('jquery'));
    } else {
      factory(jQuery);
    }
  }
  
  (function ($) {
    'use strict';

    const REFORM_LOG_PREFIX = '[Reform] ';

    /**
     * Creates the basic ˋReformˋ class.
     * As seen on slick.js
     */
    class Reform {

      /**
       * Create the neccessary Reform settings and variables.
       * @param {jQuery:Selector} parentSelector The jQuery selector for theparent element.
       * @param {Object} settings The settings the user passed.
       */
      constructor(parentSelector, settings) {

        // default settings
        this.defaults = {
          ajax: {},
          convert: 'serialize',
          debugMode: false,
          lang: 'en',
          localization: {
            en: {
              errorMinLength: 'Please enter at lease 2 characters.',
              errorValidationUrl: 'Web url not valid.',
              errorValidationEmail: 'Email address not valid.',
              errorValidationPhone: 'Phone number not valid.'
            },
            de: {
              errorMinLength: 'Bitte geben Sie mindestens 2 Zeichen an.',
              errorValidationUrl: 'Web-URL nicht gültig.',
              errorValidationEmail: 'E-Mail Adresse nicht gültig.',
              errorValidationPhone: 'Telefonnummer nicht gültig.'
            }
          },
          type: 'post',
          url: null,
          validation: {
            minLength: 2,
            displayRequireErrorInfo: false,
            displayValidationErrorInfo: true,
            submitOnRequireError: false,
            submitOnValidationError: false
          }
        };

        // other internal variables
        this.parent = parentSelector;
        this.$parent = $(parentSelector);
        this.successCounter = 0;
        this.validationError = false;
        this.$validationObject = null;
        this.options = $.extend({}, this.defaults, settings);

        // initialize this reform instance
        this.init(true);
      }
    }

    /**
     * Checks if the given argument is `typeof` the given type.
     * If the `argumentType` is not correct, the `defaultValue` gets returned.
     * 
     * @param {*} argument The argument that should be ensured
     * @param {string} argumentType The type of the log. *(`log`, `warn`, `err`)*
     * @param {*} defaultValue When true, the messages gets displayed even if the `debug` setting is false.
     * 
     * @returns {*} validatedParam
     */
    Reform.prototype.ensureParam = function(argument, argumentType, defaultValue) {
      return (typeof argument !== argumentType) ? defaultValue : argument;
    }

    /**
     * Logs the given `message` to the console.
     * 
     * @param {string} message The message that should be logged.
     * @param {string} [displayType=log] The type of the log. *(`log`, `warn`, `err`)*
     * @param {boolean} [forceDisplay=false] When true, the messages gets displayed even if the `debug` setting is false. This does not work for `displayType='err'`
     */
    Reform.prototype.out = function (message, displayType, forceDisplay) {

      // get the arguments
      displayType = this.ensureParam(displayType, 'string', '');
      forceDisplay = this.ensureParam(forceDisplay, 'boolean', false);

      // add the prefix to the log message
      if (typeof message === 'string') {
        message = REFORM_LOG_PREFIX + message;
      }

      // display the message
      switch (displayType) {
        default:
        case 'log': {
          if (forceDisplay || this.options.debugMode) {
            console.log(message);
          }
          break;
        }
        case 'warn': {
          if (forceDisplay || this.options.debugMode) {
            console.warn(message);
          }
          break;
        }
        case 'err': {
          console.error(message);
          break;
        }
      }
    }

    /**
     * Outputs the error to a specific label and optionally shows a messasge.
     * 
     * @param {jQuery} element The jQuery element ($(this))
     * @param {string} [message=null] Optional Message that gets displayed into a input, textarea or select
     */
    Reform.prototype.outputError = function (element, message) {

      message = this.ensureParam(message, 'string', '');

      $(element).addClass('rf-error');
      if (message.length > 0) {
        $(element).append('<p class="rf-error-info">' + message + '</p>');
      }
    }

    /**
     * Returns the searched label in the prefered language if possible.
     * 
     * @param {string} key The key for the searched label
     * 
     * @returns {string} label or fallback {{ key }}
     */
    Reform.prototype.getLabel = function(key) {

      // get the arguments
      key = this.ensureParam(key, 'string', '');

      // check if the requested language exists
      if (typeof this.options.localization[this.options.lang] === 'object') {

        // check if the requested key exists
        if (typeof this.options.localization[this.options.lang][key] === 'string') {
          return this.options.localization[this.options.lang][key];
        } else {
          this.out('Can\'t find key \'' + this.options.lang + '.' + key + '\'.', 'err');
          return '{{ ' + key + ' }}';
        }
      } else {
        this.out('Can\'t find localization \'' + this.options.lang + '\'.', 'err');
        return '{{ ' + key + ' }}';
      }
    }

    /**
     * Triggers an custom jQuery event that can be triggerd via `$(element).on('rf-trigger', function() {});#`
     * 
     * @param {string} triggerName The name of the trigger. (it will always get a 'rf-' prefix)
     * @param {Object} triggerArguments The arguments that should be passed
     * 
     * @returns {*} returns the result of the triggered event
     */
    Reform.prototype.callEvent = function (triggerName, triggerArguments) {
      this.out('Calling trigger-event \'rf-' + triggerName + '\'.');
      return this.$parent.triggerHandler('rf-' + triggerName, triggerArguments);
    };

    /**
     * Validates the value for a specific validation type
     * 
     * @param {string} value The value that should be validated
     * @param {string} validationType The validation type – if unknown the **rf-validateString-{validationType}**
     * 
     * @returns {boolean} true if validation succeeded
     */
    Reform.prototype.validateString = function (element, value, validationType) {

      // get the arguments
      value = this.ensureParam(value, 'string', '');
      validationType = this.ensureParam(validationType, 'string', '');

      switch (validationType) {
        case 'text': break;
        case 'url': {
          const regEx = /^(http(s?)\:\/\/|~\/|\/)?([a-zA-Z]{1}([\w\-]+\.)+([\w]{2,7}))(:[\d]{1,5})?\/?(\w+\.[\w]{3,4})?((\?\w+=\w+)?(&\w+=\w+)*)?/;
          return regEx.test(value);
        }
        case 'email': {
          const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return regEx.test(value);
        }
        case 'phone': {
          const regEx = /^(((((((00|\+)[0-9][0-9]{1,2}[ \-/]?)|0)[1-9][0-9]{1,4})[ \-/]?)|((((00|\+)49\()|\(0)[1-9][0-9]{1,4}\)[ \-/]?))[0-9]{1,7}([ \-/]?[0-9]{1,5})?)$/;
          return regEx.test(value);
        }
        case 'date': {
          // todo
          break;
        }
        default: {
          return this.callEvent('validate-custom', [value, validationType, element]);
        }
      }
    }

    /**
     * Marks the parent as initialized and adds all events.
     */
    Reform.prototype.init = function () {

      // get the parents html wrapper for the log
      const parentToString = this.$parent.prop('outerHTML').split('>', 1)[0] + '>';

      // mark as initialized
      if (!this.$parent.hasClass('rf-init')) {
        this.$parent.addClass('rf-init');

        // if there is no .rf-send button, create one
        if (!$('.rf-send', this.parent).length) {
          this.$parent.append('<button class="rf-send">' + $('input[type="submit"]', this.parent).val() + '</button>');
        }

        // hide fallback, display button
        $('.rf-send', this.parent).show();
        $('input[type="submit"]', this.parent).hide();

        // add click listener
        const _ = this;
        $('button.rf-send', this.parent).click(function(e) {
          e.stopPropagation();
          _.submit();
          return false;
        });

        // add group behavior
        this.groupBehavior();
        this.selectPlaceholder();
      }

      // add all listeners
      this.callEvent('initialize', [this.parent]);

      // log success
      this.out('Successfully initialized Reform for ' + parentToString);

    }

    /**
     * Submits the Reform
     */
    Reform.prototype.submit = function () {
      const _ = this;

      if (this.callEvent('send-before', [_.parent]) !== false) {
        if (this.callEvent('validation-before', [_.parent]) !== false) {
          this.validate();
        }
      }
    }

    /**
     * Submits the Reform
     * Get's called from Reform.submit()
     */
    Reform.prototype.validate = function () {
      const _ = this;
      let groupCounter = 0;
      let errorFound = false;

      $('.rf-error', _.parent).removeClass('rf-error');
      $('.rf-error-info', _.parent).remove();

      if ($('.rf-group', _.parent).length) {
        $('.rf-group', _.parent).each(function () {
          groupCounter++;
          let groupFound = false;
          let groupParent = this;
          let groupChildCounter = $('label', this).length;
          if ($('label', this).length == $('label.rf-req', this).length) {
            $('label', this).each(function(i) {
              if ($('input', this).is(':checked')) {
                groupFound = true;
                _.out('Group has selected child. (true)');
                if ($('.rf-group', _.parent).length == groupCounter) {
                  _.validateSingle(errorFound);
                } else {
                  return true;
                }
              } else {
                if (groupChildCounter == (i + 1)) {
                  if (!groupFound) {
                    errorFound = true;
                    $('label', groupParent).each(function () {
                      _.outputError(this);
                    });
                    _.out('Group has no selected child. (false)');
                  }
                  if ($('.rf-group', _.parent).length == groupCounter) {
                    _.validateSingle(errorFound);
                  } else {
                    return true;
                  }
                }
              }
            });
          } else {
            if ($('label.rf-req', this).length > 0) {
              _.out('Group contains mixed labels (required and not required).');
            } else {
              _.out('Group does not contain any required fields.');
            }
          }
        });
      } else {
        _.validateSingle(errorFound);
      }
    }

    /**
     * Validates every single label
     * Get's called from Reform.validate()
     *
     * @param {boolean} errorFound Value if error has already been found.
     */
    Reform.prototype.validateSingle = function (errorFound) {
      const _ = this;

      // every label
      $('label', _.parent).each(function (i) {

        // search for parent
        let found = false;
        $(this).parents().each(function() {
          if ($(this).hasClass('rf-group')) {
            found = true;
          }
        });

        if (!found) {
          if ($(this).hasClass('rf-req')) {
            switch (true) {
              case ($(this).hasClass('rf-checkbox') || $(this).hasClass('rf-radio')): {
                if (!$('input', this).is('checked')) {
                  errorFound = true;
                  _.out('Checkbox or radio did not pass validation:');
                  _.out($(this));
                  _.outputError(this);
                }
                break;
              }
              case ($('select', this).length): {
                if ($('select', this).val() == 'rf-placeholder') {
                  errorFound = true;
                  _.out('Select did not pass validation:');
                  _.out($(this));
                  _.outputError(this);
                }
                break;
              }
              default: {
                if ($('input, textarea', this).val().length < _.options.validation.minLength) {
                  errorFound = true;
                  _.out('Input or textarea did not pass validation (minLength):');
                  _.out($(this));
                  _.outputError(this);
                } else {
                  if ($(this).hasClass('rf-val')) {
                    let validationType;

                    if (typeof $(this).attr('rf-val') === 'string' && $(this).attr('rf-val').length > 1) {
                      validationType = $(this).attr('rf-val');
                    } else {
                      validationType = $('input', this).attr('type');
                    }

                    if (!_.validateString($(this), $('input', this).val(), validationType)) {
                      errorFound = true;
                      _.out('Input or textarea did not pass validation (validationType = \'' + validationType + '\'):');
                      _.out($(this));

                      _.outputError(this, _.getLabel(
                        'errorValidation' +
                        validationType.charAt(0).toUpperCase() +
                        validationType.slice(1).toLowerCase()
                      ));
                    }
                  }
                }
                break;
              }
            }
          } else {
            if ($('select', this).length) {
              if ($('select', this).val() == 'rf-placeholder') {
                $('select', this).val('');
                $('select', this).parent().addClass('rf-reselect');
              }
            }
          }
        }

        if ($('label', _.parent).length == (i + 1)) {

          if (_.callEvent('validation-after', [_.parent]) === false) {
            errorFound = false;
          }

          if (errorFound) {
            _.out('Validation was not successfully.');
          } else {
            _.out('Validation passed successfully.');
            _.sendForm();
          }
        }
      });
    }

    /**
     * Send the Reform data
     * Get's called from Reform.validateSingle()
     */
    Reform.prototype.sendForm = function () {
      const _ = this;

      // destination url
      let formUrl = this.ensureParam(_.$parent.attr('rf-url'), 'string', undefined);
      formUrl = this.ensureParam(formUrl, 'string', _.$parent.attr('action'));
      formUrl = this.ensureParam(formUrl, 'string', _.options.url);
      formUrl = this.ensureParam(formUrl, 'string', '.');

      // sending method
      let formType = this.ensureParam(_.$parent.attr('rf-type'), 'string', undefined);
      formType = this.ensureParam(formType, 'string', _.$parent.attr('method'));
      formType = this.ensureParam(formType, 'string', _.options.type);
      formType = this.ensureParam(formType, 'string', 'GET');

      // convert form data
      let formData = {};
      switch (_.options.convert) {
        case 'serialize': {
          formData = $('input, textarea, select', _.parent).serialize();
          break;
        }
        case 'json': {
          $('input, textarea, select', _.parent).each(function() {
            formData[$(this).attr('name')] = $(this).val();
          });
          break;
        }
      }

      // set up ajaxSettings
      let ajaxSetting = {
        type: formType,
        url: formUrl,
        data: formData
      };

      ajaxSetting = $.extend({}, _.options.ajax, ajaxSetting);

      console.log(ajaxSetting);

      let resultSet = undefined;
      $.ajax(ajaxSetting).done(function(resultData) {
        resultSet = resultData;
      }).fail(function() {
        _.out('Submittion was not successfull.', 'err');
      }).always(function() {
        _.afterSendForm(resultSet);
      });
    }

    Reform.prototype.afterSendForm = function (resultSet) {
      const _ = this;

      $('.rf-select.rf-reselect', this.parent).each(function() {
        $(this).removeClass('rf-reselect');
        $('select', this).val('rf-placeholder');
      });

      this.callEvent('send-after', [_.parent, resultSet]);
    }

    /**
     * Gets called with the initialisation
     * 
     * Enables group behavior for checkboxes
     */
    Reform.prototype.groupBehavior = function () {
      const _ = this;

      $('.rf-group.rf-group-single', this.parent).each(function() {
        $('input', this).change(function() {

          const inputIsChecked = $(this).is(':checked');

          $(this).closest('.rf-group.rf-group-single').find('input').prop('checked', false);
          if (inputIsChecked) {
            $(this).prop('checked', true);
          }

        });
      });
    }

    /**
     * Gets called with the initialisation
     * 
     * Enables a placeholder for selects
     */
    Reform.prototype.selectPlaceholder = function () {
      const _ = this;

      $('.rf-select', this.parent).each(function() {

        const $select = $('select', this);
        let placeholder = $select.attr('placeholder');

        if (typeof placeholder === 'string' && placeholder.length > 0) {
          $select.prepend('<option value="rf-placeholder">' + placeholder + '</option>');
          $select.val('rf-placeholder');
        }

      });
    }

    /**
     * add to jquery?
     * is from slick
     */
    $.fn.reform = function () {

      let rf = this;
      let settings = arguments[0];
      let args = Array.prototype.slice.call(arguments, 1);

      for (let i = 0; i < this.length; i++) {
        if (typeof settings === 'object' || typeof settings === 'undefined') {
          rf[i].reform = new Reform(rf[i], settings);
        } else {
          return rf[i].reform[settings].apply(rf[i].reform, args);
        }
      }

      return rf;
    };

  })
);