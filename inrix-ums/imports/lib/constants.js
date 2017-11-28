/**
 * Created by Yogesh on 8/11/17.
 */

import moment from 'moment';

export const languages = [
  {
    value: 'en-US',
    text: 'English (United States)',
    default: true
  }
];

export const defaultLanguage = languages.find(lang => lang.default);

export const dateFormats = [
  {
    value: 'YYYY-MM-DD', // moment format
    display: `YYYY-MM-DD (e.g. ${moment().format('YYYY-MM-DD')})`, // UI display
    default: true
  },
  {
    value: 'DD/MM/YYYY',
    display: `DD/MM/YYYY (e.g. ${moment().format('DD/MM/YYYY')})`
  },
  {
    value: 'MM/DD/YYYY',
    display: `MM/DD/YYYY (e.g. ${moment().format('MM/DD/YYYY')})`
  },
  {
    value: 'MMM D, YYYY',
    display: `MMM D, YYYY (e.g. ${moment().format('MMM D, YYYY')})`
  },
  {
    value: 'Do MMM YYYY',
    display: `Do MMM YYYY (e.g. ${moment().format('Do MMM YYYY')})`
  }
];

export const timeFormats = [
  {
    value: 'HH:mm:ss', // moment format
    display: `HH:mm:ss (e.g. ${moment().format('HH:mm:ss')})`, // UI display
    default: true
  },
  {
    value: 'HH:mm', // moment format
    display: `HH:mm (e.g. ${moment().format('HH:mm')})`
  },
  {
    value: 'hh:mm:ss a',
    display: `hh:mm:ss a (e.g. ${moment().format('hh:mm:ss a')})`
  },
  {
    value: 'hh:mm a',
    display: `hh:mm a (e.g. ${moment().format('hh:mm a')})`
  }
];


export const defaultDateFormat = dateFormats.find(df => df.default).value;
export const defaultTimeFormat = timeFormats.find(tf => tf.default).value;

export const defaultDateTimeFormat = `${defaultDateFormat} ${defaultTimeFormat}`;

export const dateTimeFormatISO = 'YYYY-MM-DDTHH:mm:ssZ';
export const dateFormatISO = 'YYYY-MM-DD';
export const timeFormatISO = 'HH:mm:ss';

export const defaultTimeZone = 'Etc/UTC';

export const unitSystems = [
  {
    value: 'METRIC',
    text: 'Metric',
    default: true
  },
  {
    value: 'IMPERIAL',
    text: 'Imperial'
  }
];

export const defaultUnitSystem = unitSystems.find(unSys => unSys.default);

// We cannot internationalize this list yet because the days of week is
// currently stored as array of strings in mongo and this list is compared
// against values from mongo. We need to migrate mongo studies to use weeks
// as numbers before we can internationalize this list
export const daysOfWeek = new Map([
  [1, 'INRX_Monday'],
  [2, 'INRX_Tuesday'],
  [3, 'INRX_Wednesday'],
  [4, 'INRX_Thursday'],
  [5, 'INRX_Friday'],
  [6, 'INRX_Saturday'],
  [7, 'INRX_Sunday']
]);

export const apiRequestTimeout = 60000; // 1 min

export function defaultHeaders(lang) {
  return {
    timeout: apiRequestTimeout,
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': lang || defaultLanguage.value
    }
  };
}

export const defaultDataTableSettings = {
  order: {
    column: 0,
    direction: 'desc'
  },
  lengthMenu: [[20, -1], [20, 'All']],
  columnDefs: [
    {
      visible: true,
      targets: '_all'
    }
  ]
};

export const maxStringViewableLength = 32;
