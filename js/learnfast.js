function LearnFast($scope, $http) {
  window.ngScope = $scope;
  try {
    $scope.snippets = JSON.parse(localStorage.snippets);        
  }
  catch (err) {
    $scope.snippets = [];
  }

  $scope.example = {
    source: "När de hade sagt adjö satt det åttiotvååriga födelsedagsbarnet stilla en lång stund och betraktade den vackra men betydelselösa australiensiska blomman som han ännu inte kände till namnet på. Sedan lyfte han blicken till väggen ovanför skrivbordet. Där hängde fyrtiotre pressade blommor inom glas och ram i fyra rader om tio blommor vardera och en oavslutad rad med fyra tavlor. I den översta raden saknades en tavla. Plats nummer nio gapade tom. Desert Snow skulle bli tavla nummer fyrtiofyra.",
    translated: "When they had said goodbye sat the eighty-two-year birthday child still for a long moment, looking at the pretty but meaningless Australian flower that he still did not know the name of. Then he lifted his gaze to the wall above the desk. There hung forty-three pressed flowers in a glass frame in four rows of ten flowers each, and an unfinished series of four paintings. In the top row lacking a painting. Location number nine gaped empty. Desert Snow would be number forty-four board."
  }

  $scope.showExample = function () {
    $scope.source       = $scope.example.source;
    $scope.translated   = $scope.example.translated;
  }

  $scope.start = function () {
    if ($scope.source.length == 0 && $scope.translated.length == 0) return;

    if ($scope._doLengthsCoincide()) {
      $scope.started = true;
      $scope.unevenText = false;
      $scope.sentences = $scope._getSentences();
      $scope.snippets.push($scope.sentences);
      $scope.current = 0;
    }
    else {
      $scope.unevenText = true;
    }
  }

  $scope._doLengthsCoincide = function () {
    var sourceSentences     = $scope.source.split(".");
    var translatedSentences = $scope.translated.split(".");
    return sourceSentences.length == translatedSentences.length;
  }

  $scope._getSentences = function () {
    var sentences = {
      source: $scope.source.split("."),
      translated: $scope.translated.split(".")
    }
    var pruned = {
      source: [],
      translated: []
    };

    for (index in sentences.source) {
      if (sentences.source[index].replace(/\s/g, "") != "") pruned.source.push(sentences.source[index] + ".");
    }

    for (index in sentences.translated) {
      if (sentences.translated[index].replace(/\s/g, "") != "") pruned.translated.push(sentences.translated[index] + ".");
    }
    console.log(pruned);
    return pruned;
  }

  $scope.translate = function () {
    $scope.reveal = true;
  }

  $scope.understood = function () {
    $scope.reveal = false;
    if ($scope.current + 1 < $scope.sentences.source.length) {
      $scope.current ++;          
    }

    else {
      $scope.started = false;
    }
  }

  $scope.quit = function () {
    $scope.sure = true;
  }

  $scope.totallyQuit = function () {
    $scope.started = false;
    $scope.sure = false;
  }

  $scope.cancelQuit = function () {
    $scope.sure = false;
  }

  $scope.captures = [
    {
      name: "Sample",
      source: "När de hade sagt adjö satt det åttiotvååriga födelsedagsbarnet stilla en lång stund och betraktade den vackra men betydelselösa australiensiska blomman som han ännu inte kände till namnet på. Sedan lyfte han blicken till väggen ovanför skrivbordet. Där hängde fyrtiotre pressade blommor inom glas och ram i fyra rader om tio blommor vardera och en oavslutad rad med fyra tavlor. I den översta raden saknades en tavla. Plats nummer nio gapade tom. Desert Snow skulle bli tavla nummer fyrtiofyra.",
      translated: "When they had said goodbye sat the eighty-two-year birthday child still for a long moment, looking at the pretty but meaningless Australian flower that he still did not know the name of. Then he lifted his gaze to the wall above the desk. There hung forty-three pressed flowers in a glass frame in four rows of ten flowers each, and an unfinished series of four paintings. In the top row lacking a painting. Location number nine gaped empty. Desert Snow would be number forty-four board." 
    }
  ];

  $scope.use = function (capture) {
    $scope.source = capture.source;
    $scope.translated = capture.translated;
    $scope.currentCapture = capture;
    $scope.capturing = false;
  }

  $scope.capturing = true;

  $scope.capture = function () {
    if (!$scope.started) {
      $scope.capturing = !$scope.capturing;
    }
  }

  if (FileReader) {
    $scope.fileEnabled = true;
    $scope.reader = new FileReader();
    $scope.protoCapture = {};

    $scope.reader.onload = function (event) {
      var capture = {
        name: $scope.protoCapture.name.substring(0, $scope.protoCapture.name.length - 4),
        source: event.target.result,
        translated: ""
      }
      $scope.captures.push(capture);
      $scope.use(capture);
      $scope.$apply();
    }
    
    $scope.reader.onerror = function(event) {
      alert("File could not be read! Code " + event.target.error.code);
    };

    $scope.fileAvailable = function(event) {
      $scope.protoCapture.name = event.target.files[0].name;
      $scope.reader.readAsText(event.target.files[0]);
      $scope.$apply();
    }

    $scope.file = function () {
      var event = document.createEvent("HTMLEvents");
      event.initEvent("click", true, true);
      document.getElementById('file').addEventListener("change", $scope.fileAvailable, false);
      document.getElementById('file').dispatchEvent(event);
    }
  }

  $scope.yandex = {
    getLangs: function () {
      $scope.$apply(function () {
        $http.jsonp("https://translate.yandex.net/api/v1.5/tr.json/getLangs?key=trnsl.1.1.20130923T044538Z.31636321d031f563.82efb864ff356303dec646bba4cc874a4b381127&ui=uk&callback=YandexGetLangsCallback");
      });
    }
  }
}

function YandexGetLangsCallback(data) {
  ngScope.yandex.langs = data.langs;
  ngScope.yandex.dirs = data.dirs;
}