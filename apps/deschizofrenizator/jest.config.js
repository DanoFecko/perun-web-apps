module.exports = {
  name: 'deschizofrenizator',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/deschizofrenizator',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
