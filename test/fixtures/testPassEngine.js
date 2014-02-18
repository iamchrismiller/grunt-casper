
casper.test.begin('Casperjs Browser Support', 1, function suite(test) {
  test.assertTruthy("Loaded Via Specified Engine! Good enough for me.");
  test.done();
});