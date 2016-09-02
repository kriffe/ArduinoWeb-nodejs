boolean stringComplete = false;
String inputString = "";


void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  Serial.println("Ready");  
}

void loop() {
  // put your main code here, to run repeatedly:
  if (stringComplete) {
    Serial.println(inputString);
    // clear the string:
    inputString = "";
    stringComplete = false;
  }
  //Serial.println("Yay");
  
  delay(1000);
}

void serialEvent() {
  while (Serial.available()) {
    // get the new byte:
    char inChar = (char)Serial.read();
    // add it to the inputString:
    inputString += inChar;
    // if the incoming character is a newline, set a flag
    // so the main loop can do something about it:
    if (inChar == '\n') {
      stringComplete = true;
    }
  }
}
