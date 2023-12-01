(function(thisObj) {
 
  var panel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Modulus Panel", undefined, {resizeable: true});
  panel.orientation = "column";
  panel.alignChildren = ["fill", "top"]; // Adjust alignment
  
    var factor = 1.618; // set default factor value

    var baseValue = 10;
    var modulusValues = [baseValue];
    var numModulusValues = 8;
//for (var i = 1; i <= numModulusValues; i++) {
//  modulusValues[i] = Math.round(modulusValues[i - 1] * factor);
//}
    var selectedValueIndex = 0;
    var moveAmounts = [0, 0, 0, 0, 0, 0];
    var widthValue = 0;
    var heightValue = 0;
  
  
    var panelWidth = 50;
    var panelHeight = 200;
  
    function calculateModulusValues(baseValue, factor, numValues) {
      var modulusValues = [baseValue];
      for (var i = 1; i < numValues; i++) {
        modulusValues[i] = Math.round(modulusValues[i - 1] * factor);
      }
      return modulusValues;
    }

    modulusValues = calculateModulusValues(baseValue, factor, numModulusValues);

    var baseEditText = panel.add("edittext", undefined, baseValue);
    baseEditText.onChange = function() {
      baseValue = parseInt(baseEditText.text);
      modulusValues = calculateModulusValues(baseValue, factor, numModulusValues);  
      updateValues();
    }
        
        

    var topGroup = panel.add("group");
    topGroup.orientation = "row";
    topGroup.alignChildren = ["left","center"];
    
    var factorGroup = topGroup.add("group");
    factorGroup.orientation = "row";
    
    var factor1Button = factorGroup.add("radiobutton", undefined, "1.5");
    factor1Button.onClick = function() {
      factor = 1.5;
      baseValue = parseInt(baseEditText.text);
      modulusValues = calculateModulusValues(baseValue, factor, numModulusValues);        
      updateValues();
    };
    var factorGButton = factorGroup.add("radiobutton", undefined, "G");
    factorGButton.onClick = function() {
        
        factor = 1.618;
        baseValue = parseInt(baseEditText.text);
        modulusValues = calculateModulusValues(baseValue, factor, numModulusValues);        
     
     updateValues();
    };
    var factor2Button = factorGroup.add("radiobutton", undefined, "2");
    factor2Button.onClick = function() {
      factor = 2;
      baseValue = parseInt(baseEditText.text);
      modulusValues = calculateModulusValues(baseValue, factor, numModulusValues);        
      updateValues();
    };
    factorGButton.value = true;
      
    




    var mainGroup = panel.add("group");
    mainGroup.orientation = "row";
    mainGroup.alignChildren = "fill"; // Adjust alignment
    mainGroup.alignment = "fill"; // Make the group fill the panel


var modulusGroup = mainGroup.add("group");
modulusGroup.orientation = "column";
modulusGroup.alignChildren = ["left","top"];
  
   






  
   // Update radio button layout
   var modulusRadioGroup = modulusGroup.add("group");
   modulusRadioGroup.orientation = "column";
  

   var radioButtons = [];
   for (var i = 0; i < modulusValues.length; i++) {
    var radioButton = modulusRadioGroup.add("radiobutton", undefined, modulusValues[i]);
    radioButton.preferredSize.width += 5; // increase width by 5 pixels
    radioButton.value = (i === selectedValueIndex);
    radioButton.onClick = function() {
       
        baseValue = parseInt(baseEditText.text);
        modulusValues = calculateModulusValues(baseValue, factor, numModulusValues);        
      selectedValueIndex = i;
      updateValues();
    };
    radioButtons.push(radioButton);
  }


 



    var copyButton = modulusRadioGroup.add("button", undefined, "Copy");
    copyButton.onClick = function() {
        var selectedValue = radioButtons[selectedValueIndex].text;
        copyToClipboard(selectedValue);
      };
      
    // Function to copy text to clipboard

function copyToClipboard(string) {
	var cmd, isWindows;

	string = (typeof string === 'string') ? string : string.toString();
	isWindows = $.os.indexOf('Windows') !== -1;
	
	cmd = 'echo "' + string + '" | pbcopy';
	if (isWindows) {
		cmd = 'cmd.exe /c cmd.exe /c "echo ' + string + '| clip"';
	}

	system.callSystem(cmd);
}
    
  
var moveGroup = mainGroup.add("group");
moveGroup.orientation = "column";
moveGroup.alignChildren = ["center","center"];
moveGroup.add("statictext", undefined, "Move Amounts:");



var moveAmountsGroup = moveGroup.add("group");
moveAmountsGroup.orientation = "column";
moveAmountsGroup.alignChildren = ["center", "center"];
moveAmountsGroup.spacing = 2; // set spacing to 2 pixels
var moveButtonSize= [30, 30];


var upButton = moveAmountsGroup.add("button", undefined, "↑");
upButton.size = moveButtonSize;
upButton.onClick = function () {
  moveSelectedLayers([0, -moveAmounts[selectedValueIndex], 0]); // Added 0 for Z-axis
};

var leftRightGroup = moveAmountsGroup.add("group");
leftRightGroup.orientation = "row";
leftRightGroup.alignChildren = ["center", "center"];

var leftButton = leftRightGroup.add("button", undefined, "←");
leftButton.size = moveButtonSize;
leftButton.onClick = function () {
  moveSelectedLayers([-moveAmounts[selectedValueIndex], 0, 0]); // Added 0 for Z-axis
};

var rightButton = leftRightGroup.add("button", undefined, "→");
rightButton.size = moveButtonSize;
rightButton.onClick = function () {
  moveSelectedLayers([moveAmounts[selectedValueIndex], 0, 0]); // Added 0 for Z-axis
};

var downButton = moveAmountsGroup.add("button", undefined, "↓");
downButton.size = moveButtonSize;
downButton.onClick = function () {
  moveSelectedLayers([0, moveAmounts[selectedValueIndex], 0]); // Added 0 for Z-axis
};




var forwardButton = moveAmountsGroup.add("button", undefined, "F");
forwardButton.size = moveButtonSize;
forwardButton.onClick = function () {
  moveSelectedLayers([0, 0, moveAmounts[selectedValueIndex]]);
};

var backwardButton = moveAmountsGroup.add("button", undefined, "B");
backwardButton.size = moveButtonSize;
backwardButton.onClick = function () {
  moveSelectedLayers([0, 0, -moveAmounts[selectedValueIndex]]);
};




function moveSelectedLayers(amount) {
  var activeComp = app.project.activeItem;
  if (activeComp && activeComp instanceof CompItem) {
      var selectedLayers = activeComp.selectedLayers;
      for (var i = 0; i < selectedLayers.length; i++) {
          var newPosition = selectedLayers[i].transform.position.value;
          newPosition[0] += amount[0]; // X-axis
          newPosition[1] += amount[1]; // Y-axis
          if (newPosition.length > 2) { // Check if the layer has a Z-axis
              newPosition[2] += amount[2]; // Z-axis
          }
          selectedLayers[i].transform.position.setValue(newPosition);
      }
  } else {
      alert("Please select a layer in a composition");
  }
}
  
    
  
    function updateValues() {
        selectedValueIndex = null;
        for (var i = 0; i < radioButtons.length; i++) {
          if (radioButtons[i].value) {
            selectedValueIndex = i;
            break;
          }
        }
        if (selectedValueIndex === null) {
          selectedValueIndex = 0;
          radioButtons[selectedValueIndex].value = true;
        }
        for (var i = 0; i < radioButtons.length; i++) {
          radioButtons[i].text = modulusValues[i];
        }
        for (var i = 0; i < moveAmounts.length; i++) {
          moveAmounts[i] = modulusValues[selectedValueIndex] ;
        }
      }
      
  
    
  
    updateValues();
  
    panel.onResizing = panel.onResize = function () {
      this.layout.resize();
  }

  if (panel instanceof Panel) {
      panel.layout.layout(true);
      panel.layout.resize();
  } else {
      panel.layout.layout(true);
  }

  return mainGroup;
})(this);
  