export default {
  editor: {
    label: {
      en: 'Inline Editable Input'
    },
    icon: 'text-input'
  },
  properties: {
    initialValue: {
      label: {
        en: 'Initial value'
      },
      type: 'Text',
      bindable: true,
      section: 'settings',
      defaultValue: 'Click to edit',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'A string that defines the initial value of the input'
      },
      propertyHelp: {
        tooltip: 'The starting value of the input field'
      }
      /* wwEditor:end */
    },
    placeholder: {
      label: {
        en: 'Placeholder'
      },
      type: 'Text',
      bindable: true,
      section: 'settings',
      defaultValue: 'Click to edit',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'A string that defines the placeholder text when no value is present'
      },
      propertyHelp: {
        tooltip: 'Text displayed when the input has no value'
      }
      /* wwEditor:end */
    },
    isDisabled: {
      label: {
        en: 'Disabled'
      },
      type: 'OnOff',
      bindable: true,
      section: 'settings',
      defaultValue: false,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'A boolean that defines whether the input is disabled'
      },
      propertyHelp: {
        tooltip: 'When enabled, prevents the user from interacting with the input'
      }
      /* wwEditor:end */
    },
    isLoading: {
      label: {
        en: 'Loading'
      },
      type: 'OnOff',
      bindable: true,
      section: 'settings',
      defaultValue: false,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'A boolean that defines whether the input is in a loading state'
      },
      propertyHelp: {
        tooltip: 'When enabled, displays a loading indicator and prevents editing'
      }
      /* wwEditor:end */
    },
    size: {
      label: {
        en: 'Size'
      },
      type: 'TextSelect',
      bindable: true,
      section: 'settings',
      defaultValue: 'medium',
      options: {
        options: [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' }
        ]
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'A string that defines the size of the input: "small", "medium", or "large"'
      },
      propertyHelp: {
        tooltip: 'Controls the overall size of the input'
      }
      /* wwEditor:end */
    },
    debounceTime: {
      label: {
        en: 'Debounce time (ms)'
      },
      type: 'Number',
      bindable: true,
      section: 'settings',
      defaultValue: 300,
      options: {
        min: 0,
        max: 2000,
        step: 50
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'number',
        tooltip: 'A number that defines the debounce time in milliseconds'
      },
      propertyHelp: {
        tooltip: 'Time to wait after typing stops before triggering the change event (in milliseconds)'
      }
      /* wwEditor:end */
    },
    required: {
      label: {
        en: 'Required'
      },
      type: 'OnOff',
      bindable: true,
      section: 'settings',
      defaultValue: false,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'A boolean that defines whether the field is required'
      },
      propertyHelp: {
        tooltip: 'When enabled, empty values will be considered invalid'
      }
      /* wwEditor:end */
    },
    validatePattern: {
      label: {
        en: 'Validate pattern'
      },
      type: 'Text',
      bindable: true,
      section: 'settings',
      defaultValue: '',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'A regex pattern to validate the input string'
      },
      propertyHelp: {
        tooltip: 'Regular expression pattern to validate input (e.g., "^[0-9]+$" for numbers only)'
      }
      /* wwEditor:end */
    },
    showValidateError: {
      label: {
        en: 'Show validate error'
      },
      type: 'OnOff',
      bindable: true,
      section: 'settings',
      defaultValue: false,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'A boolean that defines whether to show validation error messages'
      },
      propertyHelp: {
        tooltip: 'When enabled, displays validation error message if input doesn\'t match the pattern'
      }
      /* wwEditor:end */
    },
    validateErrorMessage: {
      label: {
        en: 'Validate error message'
      },
      type: 'Text',
      bindable: true,
      section: 'settings',
      defaultValue: '無効な入力',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'A string that defines the error message to display when validation fails'
      },
      propertyHelp: {
        tooltip: 'Custom error message to display when validation fails (default: "無効な入力")'
      }
      /* wwEditor:end */
    },
    noWrap: {
      label: {
        en: 'No wrap'
      },
      type: 'OnOff',
      bindable: true,
      section: 'settings',
      defaultValue: false,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'A boolean that prevents the text from wrapping to a new line'
      },
      propertyHelp: {
        tooltip: 'When enabled, the display text will not wrap and will stay on a single line'
      }
      /* wwEditor:end */
    },
    ellipsis: {
      label: {
        en: 'Ellipsis'
      },
      type: 'OnOff',
      bindable: true,
      section: 'settings',
      defaultValue: false,
      hidden: (content) => !content.noWrap,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'A boolean that truncates overflowing text with an ellipsis (…)'
      },
      propertyHelp: {
        tooltip: 'When enabled (requires No wrap), overflowing text is truncated with "…"'
      }
      /* wwEditor:end */
    },
    useDatePicker: {
      label: {
        en: 'Use date picker'
      },
      type: 'OnOff',
      bindable: true,
      section: 'settings',
      defaultValue: false,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'A boolean that enables the date picker functionality'
      },
      propertyHelp: {
        tooltip: 'When enabled, shows a calendar icon that opens a date picker to select dates'
      }
      /* wwEditor:end */
    },
    dateFormat: {
      label: {
        en: 'Date format'
      },
      type: 'TextSelect',
      bindable: true,
      section: 'settings',
      defaultValue: 'yyyy-MM-dd',
      options: {
        options: [
          { value: 'yyyy-MM-dd', label: 'yyyy-MM-dd (2024-01-15)' },
          { value: 'dd/MM/yyyy', label: 'dd/MM/yyyy (15/01/2024)' },
          { value: 'MM/dd/yyyy', label: 'MM/dd/yyyy (01/15/2024)' },
          { value: 'yyyy/MM/dd', label: 'yyyy/MM/dd (2024/01/15)' },
          { value: 'dd-MM-yyyy', label: 'dd-MM-yyyy (15-01-2024)' }
        ]
      },
      hidden: (content) => !content.useDatePicker,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'A string that defines the date format (e.g., "yyyy-MM-dd")'
      },
      propertyHelp: {
        tooltip: 'Format for displaying the selected date. Use yyyy for year, MM for month, dd for day.'
      }
      /* wwEditor:end */
    },
    minDate: {
      label: {
        en: 'Min date'
      },
      type: 'Text',
      bindable: true,
      section: 'settings',
      defaultValue: '',
      hidden: (content) => !content.useDatePicker,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'A date string in yyyy-MM-dd format for the minimum selectable date'
      },
      propertyHelp: {
        tooltip: 'Minimum date that can be selected (format: yyyy-MM-dd). Leave empty for no limit.'
      }
      /* wwEditor:end */
    },
    maxDate: {
      label: {
        en: 'Max date'
      },
      type: 'Text',
      bindable: true,
      section: 'settings',
      defaultValue: '',
      hidden: (content) => !content.useDatePicker,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'A date string in yyyy-MM-dd format for the maximum selectable date'
      },
      propertyHelp: {
        tooltip: 'Maximum date that can be selected (format: yyyy-MM-dd). Leave empty for no limit.'
      }
      /* wwEditor:end */
    },
    datePickerAriaLabel: {
      label: {
        en: 'Date picker aria label'
      },
      type: 'Text',
      bindable: true,
      section: 'settings',
      defaultValue: 'Open date picker',
      hidden: (content) => !content.useDatePicker,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Accessibility label for the date picker trigger button'
      },
      propertyHelp: {
        tooltip: 'Screen reader label for the date picker button'
      }
      /* wwEditor:end */
    },
    defaultStateStyles: {
      label: {
        en: 'Default state styles'
      },
      type: 'Object',
      section: 'style',
      bindable: true,
      defaultValue: {
        color: '#333333',
        fontFamily: 'inherit',
        fontSize: '1rem',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none'
      },
      options: {
        item: {
          color: {
            label: { en: 'Text color' },
            type: 'Color',
            options: { nullable: true }
          },
          fontFamily: {
            label: { en: 'Font family' },
            type: 'FontFamily'
          },
          fontSize: {
            label: { en: 'Font size' },
            type: 'Text'
          },
          fontWeight: {
            label: { en: 'Font weight' },
            type: 'TextSelect',
            options: {
              options: [
                { value: 'normal', label: 'Normal' },
                { value: 'bold', label: 'Bold' },
                { value: '100', label: '100' },
                { value: '200', label: '200' },
                { value: '300', label: '300' },
                { value: '400', label: '400' },
                { value: '500', label: '500' },
                { value: '600', label: '600' },
                { value: '700', label: '700' },
                { value: '800', label: '800' },
                { value: '900', label: '900' }
              ]
            }
          },
          fontStyle: {
            label: { en: 'Font style' },
            type: 'TextSelect',
            options: {
              options: [
                { value: 'normal', label: 'Normal' },
                { value: 'italic', label: 'Italic' }
              ]
            }
          },
          textDecoration: {
            label: { en: 'Text decoration' },
            type: 'TextSelect',
            options: {
              options: [
                { value: 'none', label: 'None' },
                { value: 'underline', label: 'Underline' },
                { value: 'line-through', label: 'Line through' }
              ]
            }
          }
        }
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'object',
        tooltip: 'An object that defines the styles for the default state'
      },
      propertyHelp: {
        tooltip: 'Customize the appearance of the text in its default state'
      }
      /* wwEditor:end */
    },
    hoverStateStyles: {
      label: {
        en: 'Hover state styles'
      },
      type: 'Object',
      section: 'style',
      bindable: true,
      defaultValue: {
        color: '#4a90e2',
        textDecoration: 'none'
      },
      options: {
        item: {
          color: {
            label: { en: 'Text color' },
            type: 'Color',
            options: { nullable: true }
          },
          fontFamily: {
            label: { en: 'Font family' },
            type: 'FontFamily'
          },
          fontSize: {
            label: { en: 'Font size' },
            type: 'Text'
          },
          fontWeight: {
            label: { en: 'Font weight' },
            type: 'TextSelect',
            options: {
              options: [
                { value: 'normal', label: 'Normal' },
                { value: 'bold', label: 'Bold' },
                { value: '100', label: '100' },
                { value: '200', label: '200' },
                { value: '300', label: '300' },
                { value: '400', label: '400' },
                { value: '500', label: '500' },
                { value: '600', label: '600' },
                { value: '700', label: '700' },
                { value: '800', label: '800' },
                { value: '900', label: '900' }
              ]
            }
          },
          fontStyle: {
            label: { en: 'Font style' },
            type: 'TextSelect',
            options: {
              options: [
                { value: 'normal', label: 'Normal' },
                { value: 'italic', label: 'Italic' }
              ]
            }
          },
          textDecoration: {
            label: { en: 'Text decoration' },
            type: 'TextSelect',
            options: {
              options: [
                { value: 'none', label: 'None' },
                { value: 'underline', label: 'Underline' },
                { value: 'line-through', label: 'Line through' }
              ]
            }
          }
        }
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'object',
        tooltip: 'An object that defines the styles for the hover state'
      },
      propertyHelp: {
        tooltip: 'Customize the appearance of the text when hovered'
      }
      /* wwEditor:end */
    },
    focusStateStyles: {
      label: {
        en: 'Focus state styles'
      },
      type: 'Object',
      section: 'style',
      bindable: true,
      defaultValue: {
        color: '#333333',
        backgroundColor: '#ffffff',
        borderColor: '#4a90e2'
      },
      options: {
        item: {
          color: {
            label: { en: 'Text color' },
            type: 'Color',
            options: { nullable: true }
          },
          fontFamily: {
            label: { en: 'Font family' },
            type: 'FontFamily'
          },
          fontSize: {
            label: { en: 'Font size' },
            type: 'Text'
          },
          fontWeight: {
            label: { en: 'Font weight' },
            type: 'TextSelect',
            options: {
              options: [
                { value: 'normal', label: 'Normal' },
                { value: 'bold', label: 'Bold' },
                { value: '100', label: '100' },
                { value: '200', label: '200' },
                { value: '300', label: '300' },
                { value: '400', label: '400' },
                { value: '500', label: '500' },
                { value: '600', label: '600' },
                { value: '700', label: '700' },
                { value: '800', label: '800' },
                { value: '900', label: '900' }
              ]
            }
          },
          fontStyle: {
            label: { en: 'Font style' },
            type: 'TextSelect',
            options: {
              options: [
                { value: 'normal', label: 'Normal' },
                { value: 'italic', label: 'Italic' }
              ]
            }
          },
          textDecoration: {
            label: { en: 'Text decoration' },
            type: 'TextSelect',
            options: {
              options: [
                { value: 'none', label: 'None' },
                { value: 'underline', label: 'Underline' },
                { value: 'line-through', label: 'Line through' }
              ]
            }
          },
          backgroundColor: {
            label: { en: 'Background color' },
            type: 'Color',
            options: { nullable: true }
          },
          borderColor: {
            label: { en: 'Border color' },
            type: 'Color',
            options: { nullable: true }
          }
        }
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'object',
        tooltip: 'An object that defines the styles for the focus state'
      },
      propertyHelp: {
        tooltip: 'Customize the appearance of the input when focused/editing'
      }
      /* wwEditor:end */
    }
  },
  triggerEvents: [
    {
      name: 'change',
      label: { en: 'On change' },
      event: { value: '' },
      default: true
    },
    {
      name: 'blur',
      label: { en: 'On blur' },
      event: { value: '' }
    },
    {
      name: 'initValueChange',
      label: { en: 'On init value change' },
      event: { value: '' }
    },
    {
      name: 'dateSelected',
      label: { en: 'On date selected' },
      event: { value: '', date: null }
    }
  ],
  actions: [
    {
      name: 'setProcessing',
      label: { en: 'Set Processing' },
      args: [
        {
          name: 'value',
          type: 'boolean',
          label: { en: 'Is Processing' },
          /* wwEditor:start */
          bindingValidation: {
            type: 'boolean',
            tooltip: 'Set to true to disable the input, false to enable it'
          }
          /* wwEditor:end */
        }
      ]
    }
  ]
};