/**
 * Created by Yogesh on 5/31/17.
 */
import $ from 'jquery';

import './template/data_table.js';

import {
  defaultDataTableSettings
} from '../lib/constants.js';

export default function dataTable(options) {
  if (undefined === options) {
    throw new Error('Required parameter options missing while trying to create dataTable');
  }

  if (undefined === options.name) {
    throw new Error('Required parameter options.name missing while trying to create dataTable');
  }

  const _dtName = options.name;
  const _dtSettings = $.extend(true, {}, defaultDataTableSettings);

  if (undefined !== options.order) {
    _dtSettings.order = [[options.order.column, options.order.direction]];
  }

  if (undefined !== options.hiddenCols) {
    _dtSettings.columnDefs.splice(0, 0, {
      visible: false,
      targets: options.hiddenCols
    });
  }

  if (undefined !== options.translations) {
    _dtSettings.language = options.translations;
  }

  return {
    get dtName() {
      return _dtName;
    },
    get dtSettings() {
      return _dtSettings;
    }
  };
}