export default {
  editor: {
    label: {
      en: 'Range Filter'
    },
    icon: 'filter'
  },
  properties: {
    type: {
      label: { en: 'Type' },
      type: 'TextSelect',
      bindable: true,
      section: 'settings',
      defaultValue: 'number',
      options: {
        options: [
          { value: 'number', label: 'Number' },
          { value: 'date', label: 'Date' }
        ]
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'The type of range filter: "number" or "date"'
      },
      propertyHelp: {
        tooltip: 'Choose between number inputs or date pickers for the range values.'
      }
      /* wwEditor:end */
    },
    label: {
      label: { en: 'Button Label' },
      type: 'Text',
      bindable: true,
      defaultValue: 'Range',
      section: 'settings',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'The label displayed on the trigger button'
      },
      propertyHelp: {
        tooltip: 'The text displayed on the trigger button.'
      }
      /* wwEditor:end */
    },
    fromLabel: {
      label: { en: 'From Label' },
      type: 'Text',
      bindable: true,
      section: 'settings',
      defaultValue: '',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'The label for the "from" input field'
      },
      propertyHelp: {
        tooltip: 'Custom label for the "from" input. Defaults to "開始値" for numbers or "開始日" for dates.'
      }
      /* wwEditor:end */
    },
    toLabel: {
      label: { en: 'To Label' },
      type: 'Text',
      bindable: true,
      section: 'settings',
      defaultValue: '',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'The label for the "to" input field'
      },
      propertyHelp: {
        tooltip: 'Custom label for the "to" input. Defaults to "終了値" for numbers or "終了日" for dates.'
      }
      /* wwEditor:end */
    },
    initialFromValue: {
      label: { en: 'Initial From Value' },
      type: 'Text',
      bindable: true,
      section: 'settings',
      defaultValue: null,
      /* wwEditor:start */
      bindingValidation: {
        type: 'any',
        tooltip: 'The initial "from" value. For dates, use ISO format (YYYY-MM-DD).'
      },
      propertyHelp: {
        tooltip: 'The initial value for the "from" field. Use numbers for number type or ISO date strings for date type.'
      }
      /* wwEditor:end */
    },
    initialToValue: {
      label: { en: 'Initial To Value' },
      type: 'Text',
      bindable: true,
      section: 'settings',
      defaultValue: null,
      /* wwEditor:start */
      bindingValidation: {
        type: 'any',
        tooltip: 'The initial "to" value. For dates, use ISO format (YYYY-MM-DD).'
      },
      propertyHelp: {
        tooltip: 'The initial value for the "to" field. Use numbers for number type or ISO date strings for date type.'
      }
      /* wwEditor:end */
    },
    fromMinValue: {
      label: { en: 'From Min Value' },
      type: 'Text',
      bindable: true,
      section: 'settings',
      defaultValue: null,
      /* wwEditor:start */
      bindingValidation: {
        type: 'any',
        tooltip: 'The minimum allowed value for the "from" field'
      },
      propertyHelp: {
        tooltip: 'Set the minimum allowed value for the "from" field. The "to" field will also use this as its minimum when a "from" value is selected.'
      }
      /* wwEditor:end */
    },
    toMaxValue: {
      label: { en: 'To Max Value' },
      type: 'Text',
      bindable: true,
      section: 'settings',
      defaultValue: null,
      /* wwEditor:start */
      bindingValidation: {
        type: 'any',
        tooltip: 'The maximum allowed value for the "to" field'
      },
      propertyHelp: {
        tooltip: 'Set the maximum allowed value for the "to" field. The "from" field will also use this as its maximum when a "to" value is selected.'
      }
      /* wwEditor:end */
    },
    separatorText: {
      label: { en: 'Separator Text' },
      type: 'Text',
      bindable: true,
      section: 'settings',
      defaultValue: '〜',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'The text used as separator between from and to values'
      },
      propertyHelp: {
        tooltip: 'The text displayed between the from and to values in both the dropdown and the selected value display.'
      }
      /* wwEditor:end */
    },
    applyButtonText: {
      label: { en: 'Apply Button Text' },
      type: 'Text',
      bindable: true,
      section: 'settings',
      defaultValue: '適用',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'The text displayed on the apply button'
      },
      propertyHelp: {
        tooltip: 'Customize the text shown on the apply button in the dropdown.'
      }
      /* wwEditor:end */
    },
    clearButtonText: {
      label: { en: 'Clear Button Text' },
      type: 'Text',
      bindable: true,
      section: 'settings',
      defaultValue: 'クリア',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'The text displayed on the clear button'
      },
      propertyHelp: {
        tooltip: 'Customize the text shown on the clear button in the dropdown.'
      }
      /* wwEditor:end */
    },
    dateLocale: {
      label: { en: 'Date Locale' },
      type: 'Text',
      bindable: true,
      section: 'settings',
      defaultValue: 'ja-JP',
      hidden: content => content.type !== 'date',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'The locale to use for date formatting (e.g., "en-US", "ja-JP", "fr-FR")'
      },
      propertyHelp: {
        tooltip: 'Set the locale for date formatting. This affects how dates are displayed in the selected value.'
      }
      /* wwEditor:end */
    },
    debounceChange: {
      label: { en: 'Change debounce (ms)' },
      type: 'Number',
      bindable: true,
      section: 'settings',
      defaultValue: 500,
      /* wwEditor:start */
      bindingValidation: {
        type: 'number',
        tooltip: 'Debounce delay in milliseconds for the change event'
      },
      propertyHelp: {
        tooltip: 'The delay in milliseconds before triggering the change event after input. Useful to reduce API calls when the range values change.'
      }
      /* wwEditor:end */
    }
  },
  triggerEvents: [
    {
      name: 'change',
      label: { en: 'On value change' },
      event: { value: { from: null, to: null } },
      default: true
    },
    {
      name: 'initValueChange',
      label: { en: 'On initial value change' },
      event: { value: { from: null, to: null } }
    },
    {
      name: 'apply',
      label: { en: 'On apply' },
      event: { value: { from: null, to: null } }
    },
    {
      name: 'clear',
      label: { en: 'On clear' },
      event: {}
    },
    {
      name: 'open',
      label: { en: 'On dropdown open' },
      event: {}
    },
    {
      name: 'close',
      label: { en: 'On dropdown close' },
      event: {}
    }
  ],
  actions: [
    {
      action: 'openDropdown',
      label: { en: 'Open dropdown' }
    },
    {
      action: 'closeDropdown',
      label: { en: 'Close dropdown' }
    },
    {
      action: 'clearSelection',
      label: { en: 'Clear selection' }
    },
    {
      action: 'resetToInitial',
      label: { en: 'Reset to initial value' }
    }
  ]
};