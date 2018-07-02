# Reform.js

*Modern forms finally made easy.*

> **Note**: In order to use this JavaScirpt plugin an instance of jQuery 3.0 or higher is required. You can [get jQuery here](https://jquery.com).

### Table of Contents

1. [Installation](#installation)
    - [Download](#classic-download)
    - [CDN](#cdn)
    - [NPM](#npm)
1. [Sample Useage](#sample-useage)
1. [Input / Textarea](#input--textarea)
1. [Checkbox / Radio](#checkbox--radio)
1. [Select](#select)
1. [JavaScript Settings](#javascript-settings)
    - [General Settings](#general-settings)
    - [Localisation Settings](#localisation-settings)
    - [Validation Settings](#validation-settings)
1. [Events](#events)
1. [Information](#information)
    - [Browser Support](#browser-support)
    - [Dependencies](#dependencies)
    - [Copyright and Licence](#copyright-and-license)

<br>

## Installation

Reform.js is available as a classic download, via CDN and via NPM.

### Download
[**Download latest Reform.js** *(compressed)*](https://raw.githubusercontent.com/danielneubert/Reform.js/master/dist/reform.min.js)

### CDN
```html
<script src="https://cdn.jsdelivr.net/npm/reform.js@1.0.2/dist/reform.min.js"></script>
```

### NPM
```sh
npm install reform.js
```

<br>

## Sample Useage

This chapter shows some exsamples how to correctly use Reform.js.

### Setup and passing Settings

Besides adding the reform.js file at the end of your HTML-file right before closing the body-Tag after the jQuery file you have to add the following line into your JavaScript file:
```js
$(document).ready(function() {
  $('form').reform();
})
```
You can also pass some settings for reform by simply changing the code above like this:
```js
$(document).ready(function() {
  $('form').reform({
    debugMode: true
  });
})
```

<br>

## Input / Textarea

### Sample Build
```html
<!-- basic input -->
<label>
  <p>Sample</p>
  <input type="text" name="sample">
</label>

<!-- basic textarea -->
<label>
  <p>Sample</p>
  <textarea name="sample"></textarea>
</label>

<!-- full example-->
<label class="rf-req rf-val" rf-val="email">
  <p>Sample</p>
  <input type="email" name="sample">
</label>
```

### CSS / LESS Rules
```less
// default
label {}
label > p {}
label > input {}

// error
label.rf-error {}
label.rf-error > p {}
label.rf-error > input {}

// error information
label.rf-error > p.rf-error-info {}
```

### Class List

|Class|Description|
|-----|-----|
|`.rf-req`|Require this input field. ([see minLength setting](?site=settings))|
|`.rf-val`|After passing the required minLength the value gets validated for the setting. You can either pass the validation type via the attribute `rf-val=""` or Reform.js takes the input type for validation. This is the importance-ranking:<ol><li>`rf-val=""`</li><li>`type=""`</li></ol>|

### Attribute List

|Attribute|Description|
|-----|-----|
|`rf-val="`*`{string}`*`"`|This attribute contains the validation type you want the value to be validated for. These are all types:<ul><li>`url`</li><li>`email`</li><li>`phone`</li><li>`date` *– support planned for Reform.js v1.1.0*</li><li>`custom` – You can enter a custom validation type into `rf-val=""` and fetch the `rf-validate-custom` event. ([see more](#events))</li></ul>|

<br>

## Checkbox / Radio
### Sample Build
```html
<!-- basic checkbox -->
<label class="rf-checkbox">
  <input type="checkbox" name="sample">
  <p>Sample</p>
</label>

<!-- basic radio -->
<label class="rf-radio">
  <input type="radio" name="sample">
  <p>Sample</p>
</label>

<!-- required checkbox or radio -->
<label class="rf-checkbox rf-req">
  <input type="checkbox" name="sample">
  <p>Sample</p>
</label>
```

### CSS / LESS Rules
```less
// default checkbox and radio
label.rf-checkbox, label.rf-radio {}
label.rf-checkbox > p, label.rf-radio > p {}
label.rf-checkbox > input, label.rf-radio > input {}

// checkbox styling
label.rf-checkbox > p::before {}
label.rf-checkbox > p::after {}

// radio styling
label.rf-radio > p::before {}
label.rf-radio > p::after {}

// checked checkbox styling
label.rf-checkbox > input:checked + p::before {}
label.rf-checkbox > input:checked + p::after {}

// checked radio styling
label.rf-radio > input:checked + p::before {}
label.rf-radio > input:checked + p::after {}

// error
label.rf-checkbox.rf-error, label.rf-radio.rf-error {}
label.rf-checkbox.rf-error p, label.rf-radio.rf-error p {}
label.rf-checkbox.rf-error p::before, label.rf-radio.rf-error p::before {}
```

### Class List
|Class|Description|
|-----|-----|
|`.rf-req`|Require this checkbox or radio field.|
|`.rf-radio`|This is for a radio field.|
|`.rf-checkbox`|This is for a checkbox field.|

#### Grouping
You can group checkboxes or radios with required fields. With that, only one of the checkboxes or radios have to be checked to pass the requirement. In addition, checkboxes behave like radio buttons but a checked element can be unchecked by an user.

This for example can be used to request genders optionally with radio-button styling:
```html
<p>Gender</p>
<div class="rf-group">
  <label class="rf-radio rf-req">
    <input type="checkbox" name="gender" value="female">
    <p>Female</p>
  </label>
  <label class="rf-radio rf-req">
    <input type="checkbox" name="gender" value="male">
    <p>Male</p>
  </label>
</div>
```

<br>

## Select
### Sample Build
```html
<label class="rf-select">
  <p>Sample</p>
  <select name="sample" placeholder="Please select ...">
    <option>Option 1</option>
    <option>Option 2</option>
    <option>Option 3</option>
  </select>
</label>
```
> **Note**: As you can see in the code sample above Reform.js adds the posibility to add a placeholder to your select. Adding the `placeholder=""` attribute to your select will act just like you expect to.

### CSS / LESS Rules
```less
// default select
label.rf-select {}
label.rf-select > p {}
label.rf-select > select {}
label.rf-select::after {}

// error
label.rf-select.rf-error{}
label.rf-select.rf-error > p {}
label.rf-select.rf-error > select {}
```

### Class List
|Class|Description|
|-----|-----|
|`.rf-req`|Require this checkbox or radio field.|
|`.rf-select`|Defines that this label contains an select.|

<br>

## JavaScript Settings

### General Settings
```js
this.defaults = {
  ajax: {},
  convert: 'serialize',
  debugMode: false,
  lang: 'en',
  localization: { ... },
  type: 'post',
  url: null,
  validation: { ... }
};
```
|Setting|Type|Default|Description|
|-|-|-|-|
|`ajax`|`object`|`{}`|Since Reform is build uppon the [jQuery.ajax()](#1) function you can fully manipulate the ajax as noted in the [jQuery.ajax() documentation](#1).<br>This excludes settings Reform.js overwrites. (`data`, `type` and `url`)|
|`convert`|`string`|`'serialize'`|This setting determines how the input-data within your reform element should be converted for sending. These are the default convertion types:<ul style="margin:5px 0"><li>'serialize'</li><li>'json'</li></ul>You can additionally add a custom convert type. Read more about [Events](#events).|
|`debugMode`|`boolean`|`false`|If true, Reform.js logs every single step it processes. *(initalizing, validating, sending)*|
|`lang`|`string`|`'en'`|Every message your user can see can be manipulated via the `localisation` setting. Read more about [Localisation](#settings-localisation).|
|`localisation`|`object`|`{ ... }`|See more about in the sub-section [Localisation Settings Description](#localisation-settings-description)|
|`type`|`string`|`'post'`|The send-type can be manipulated with this setting. It is the type-setting of the [jQuery.ajax()](#1) function and can be manipulated with this setting. The send-type can be overwritten by the form's mthod setting and additionally can also be overwritten by the rf-type attribute. This is the ranking: <ol style="margin:5px 0"><li>`rf-type` attribute</li><li>`method` attribute</li><li>`type` setting</li><li>'post' default parameter</li></ol>|
|`url`|`string`|`null`|The destination url the data should be sent to. This could be overwritten with `action` or `rf-url` attribute. This is the ranking: <ol style="margin:5px 0"><li>`rf-url` attribute</li><li>`action` attribute</li><li>`url` setting</li></ol>|
|`validation`|`object`|`{ ... }`|See more about in the sub-section [Validation Settings Description](#validation-settings-description)|

### Localisation Settings
```js
this.defaults = {
  localization: {
    en: {
      errorMinLength: 'Please enter at lease 2 characters.',
      errorValidationUrl: 'Web url not valid.',
      errorValidationEmail: 'Email address not valid.',
      errorValidationPhone: 'Phone number not valid.',
      errorValidationCustom: 'Field could not be validated.'
    }
  }
};
```
|Key|Default|
|-|-|
|`errorMinLength`|Please enter at lease 2 characters.|
|`errorValidationUrl`|Web url not valid.|
|`errorValidationEmail`|Email address not valid.|
|`errorValidationPhone`|Phone number not valid.|
|`errorValidationCustom`|Field could not be validated.|
### Validation Settings
```js
this.defaults = {
  validation: {
    minLength: 2,
    displayRequireErrorInfo: false,
    displayValidationErrorInfo: true,
    submitOnRequireError: false,
    submitOnValidationError: false
  }
};
```
|Setting|Type|Default|Description|
|-|-|-|-|
|`minLength`|`integer`|`2`|The minimum length of characters a required field has to contain.|
|`displayRequireErrorInfo`|`boolean`|`false`|If true any field that does not pass the required parameters gets a `p.error-info` element added.|
|`displayValidationErrorInfo`|`boolean`|`true`|If true any field that can not be validated gets a `p.error-info` element added.|
|`submitOnRequireError`|`boolean`|`false`|Also submits a form if some input fields does not pass the required parameters.|
|`submitOnValidationError`|`boolean`|`false`|Also submits a form if some input fields can not be validated.|

<br>

## Events
### Example code for calling an event
```js
var reform = $(element).reform();

reform.on('rf-validation-after', function(reformParent) {
  console.log('Reform is validated.');
});
```

### All events
|Event|Parameters and Description|
|-----|-----------|
|`rf-initialize`|Gets called after Reform got initialized.<ol><li>*`{ReformObject}`*`: reform`</li></ol>|
|`rf-send-before`|Gets called after a user started submitting the Reform form.<ol><li>*`{ReformObject}`*`: reform`</li></ol><ul><li>`return` *`{boolean}`*`:` – if *`false`*, the submit will be chancled</li></ul>|
|`rf-validation-before`|Gets called after successfull `submit-start` and before the validation.<ol><li>*`{ReformObject}`*`: reform`</li></ol>|
|`rf-validate-custom`|Gets called if a custom value is placed in the rf-val attribute.<ol><li>*`{string}`*`: value`</li><li>*`{string}`*`: validationType` – The value in the rf-val attribute.</li><li>*`{jQuery}`*`: element` – the wrapping label element. can be used like `$(element)`.</li></ol><ul><li>`return` *`{boolean}`*`:` – determines if the validation was successfull. *(true means passed)*</li></ul>|
|`rf-validation-after`|Gets called after the validation is completed.<ol><li>*`{ReformObject}`*`: reform`</li><li>*`{boolean}`*`: errorFound` – if *`ture`*, the form was not validated successfully</li></ol><ul><li>`return` *`{boolean}`*`:` if *`false`*, the submit will be chancled</li></ul>|
|`rf-send-after`|Gets called if the submit request via ajax was successfull.<ol><li>*`{ReformObject}`*`: reform`</li><li>*`{\*}`*: result`</li></ol>|

<br>

## Information
### Browser support

Reform.js supports Internet Explorer 10+ and the latest two versions of Google Chrome, Mozilla Firefox, Opera, Apple Safari and Microsoft Edge. *(earlier versions may work but aren't tested)*

### Dependencies

jQuery 3.0+ *(earlier versions may work but aren't tested)*

### Copyright and License

Copyright © 2018 Daniel Neubert<br>
Licensed under the MPL 2.0 license.
