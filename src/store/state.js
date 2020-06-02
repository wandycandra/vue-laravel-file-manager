export default {
  /**
   * Active manager
   * left or right
   * default: left
   */
  activeManager: 'left',
  mainDir:null,
  dataS:[],

  /**
   * Clipboard
   * Operation type - copy || cut
   */
  clipboard: {
    type: null,
    disk: null,
    directories: [],
    files: [],
  },

  // available disks
  disks: [],

  // file callback for ckeditor, ...
  fileCallback: null,

  // full screen mode
  fullScreen: false,
};
