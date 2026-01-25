export default {
  editor: {
    label: {
      en: 'ComboBox'
    },
    icon: 'menu'
  },
  properties: {
    label: {
      label: { en: 'Label' },
      type: 'Text',
      bindable: true,
      defaultValue: 'Select',
      section: 'settings',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'A string that defines the label displayed on the trigger button'
      },
      propertyHelp: {
        tooltip: 'The text displayed on the trigger button'
      }
      /* wwEditor:end */
    },
    options: {
      label: { en: 'Options' },
      type: 'Array',
      bindable: true,
      section: 'settings',
      defaultValue: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' }
      ],
      options: {
        expandable: true,
        getItemLabel(_, index) {
          return `Option ${index + 1}`;
        },
        item: {
          type: 'Object',
          defaultValue: {
            value: '',
            label: '',
            icon: null
          },
          options: {
            item: {
              value: {
                label: 'Value',
                type: 'Text',
                options: { placeholder: 'Value' }
              },
              label: {
                label: 'Label',
                type: 'Text',
                options: { placeholder: 'Label' }
              },
              icon: {
                label: 'Icon',
                type: 'Text',
                options: { placeholder: 'Icon name (optional)' }
              }
            }
          }
        }
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip: 'An array of options to display in the dropdown. Each option can be a string or an object with value, label, and optional icon properties.'
      },
      propertyHelp: {
        tooltip: 'The list of options to display in the dropdown. You can provide simple strings or objects with value, label, and icon properties.'
      }
      /* wwEditor:end */
    },
    initialValue: {
      label: { en: 'Initial value' },
      type: 'Text',
      bindable: true,
      section: 'settings',
      defaultValue: null,
      /* wwEditor:start */
      bindingValidation: {
        type: 'any',
        tooltip: 'The initial value of the combobox. For single select, provide a string or null. For multi-select, provide an array of strings.'
      },
      propertyHelp: {
        tooltip: 'The initial selected value(s). For single select mode, this should be a string matching an option value. For multi-select mode, this should be an array of strings.'
      }
      /* wwEditor:end */
    },
    multiSelect: {
      label: { en: 'Multi-select' },
      type: 'OnOff',
      bindable: true,
      section: 'settings',
      defaultValue: false,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Enable multi-select mode to allow selecting multiple options'
      },
      propertyHelp: {
        tooltip: 'When enabled, users can select multiple options. The dropdown will stay open after selection and show a count of selected items.'
      }
      /* wwEditor:end */
    },
    hideSearchBar: {
      label: { en: 'Hide search bar' },
      type: 'OnOff',
      bindable: true,
      section: 'settings',
      defaultValue: false,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Hide the search bar in the dropdown'
      },
      propertyHelp: {
        tooltip: 'When enabled, the search bar will be hidden from the dropdown. Useful for small lists or when search is not needed.'
      }
      /* wwEditor:end */
    },
    iconKey: {
      label: { en: 'Show icons' },
      type: 'OnOff',
      bindable: true,
      section: 'settings',
      defaultValue: false,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Enable icon display for options'
      },
      propertyHelp: {
        tooltip: 'When enabled, icons will be displayed next to options if provided in the options data.'
      }
      /* wwEditor:end */
    },
    isLoading: {
      label: { en: 'Is loading' },
      type: 'OnOff',
      bindable: true,
      section: 'settings',
      defaultValue: false,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Show loading state in the dropdown'
      },
      propertyHelp: {
        tooltip: 'When enabled, displays a loading spinner in the options list. Use this when initially loading data.'
      }
      /* wwEditor:end */
    },
    isLoadingMore: {
      label: { en: 'Is loading more' },
      type: 'OnOff',
      bindable: true,
      section: 'settings',
      defaultValue: false,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Show loading more indicator at the bottom of the list'
      },
      propertyHelp: {
        tooltip: 'When enabled, displays a "loading more" indicator at the bottom of the options list. Use this for infinite scroll pagination.'
      }
      /* wwEditor:end */
    },
    debounceSearch: {
      label: { en: 'Search debounce (ms)' },
      type: 'Number',
      bindable: true,
      section: 'settings',
      defaultValue: 500,
      /* wwEditor:start */
      bindingValidation: {
        type: 'number',
        tooltip: 'Debounce delay in milliseconds for search input'
      },
      propertyHelp: {
        tooltip: 'The delay in milliseconds before triggering the search-change event. Useful to reduce API calls when searching.'
      }
      /* wwEditor:end */
    }
  },
  triggerEvents: [
    {
      name: 'change',
      label: { en: 'On value change' },
      event: { value: null },
      default: true
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
    },
    {
      name: 'initValueChange',
      label: { en: 'On init value change' },
      event: { value: null }
    },
    {
      name: 'search-change',
      label: { en: 'On search change' },
      event: {
        query: ''
      }
    },
    {
      name: 'reach-last-item',
      label: { en: 'On reach last item' },
      event: {
        scrollTop: 0,
        scrollHeight: 0,
        clientHeight: 0
      }
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
    },
    {
      action: 'selectOption',
      label: { en: 'Select option' },
      args: [
        {
          name: 'option',
          type: 'any',
          label: { en: 'Option value' }
        }
      ]
    }
  ]
};
