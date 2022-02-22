BSM (Body Sugar Monitoring) alerts

Table of Contents

•	Introduction: a brief introduction about the problem

•	Architecture: architecture of the proposed system

•	Installation&run: description of installation steps


Introduction

Blood sugar, or Sugar, is the main sugar found in blood. The body gets Sugar from the food we eat. This sugar is an important source of energy and provides nutrients to the body's organs, muscles and nervous system. The absorption, storage and production of Sugar is regulated constantly by complex processes involving the small intestine, liver and pancreas. Therefore, patients use BSM sensors to measure blood Sugar values continuously to have information about changes on time. Also, it’s important to have all this information about blood Sugar levels history for further treatment. If the Sugar level is too high, this means that the patient is not adhering to the treatment prescribed by the doctor. In this case, important to have some direct connection to the doctor. The project tried to solve this problem with the help of serverless functions.

First, have historical Sugar data to understand the effectiveness of treatment.

Second,  to have a direct connection with the doctor in critical situations.

BSM Alerts is a project created to demonstrate serverless computing capabilities by using a simulated blood Sugar sensor and functions that trigger actions and generate alerts. This project contains a simulated CGM sensor that uses a random function to generate a Sugar value. The range of values is between 50-140mg / dL. (real range of Sugar value that a person can have). If values are more than 140 mg/dL, it means that the health of the patient is in critical status, and the system will send alerts to the doctor by using IFTTT webhooks and email services. Otherwise, an app client will receive information about blood Sugar levels.

Architecture
To send the blood Sugar values there is the function 'sendhealthdata' on Nuclio. This function generates random blood Sugar values simulating a real CGM sensor. These values are published on the queue 'iot/bloodSugar' of RabbitMQ. When a message is published in the queue 'iot/bloodSugar', the function 'bloodSugarmanager' is triggered. This function consumes the message on the queue and takes decisions: it sends the value of the blood Sugar to an app client through the MQTT protocol and if the value is above the given threshold is sent an email to the doctor through IFTTT triggers. It is also available a Logger that builds a log with the date and time of all entries published on the 'iot/bloodSugar' queue.

![image](https://user-images.githubusercontent.com/86609798/155203243-c3a31b77-3af6-4b09-b0cc-ac23d6c2cdc7.png)

 

Installation&Run

•	Install Docker from the official website

•	Install RabbitMQ by running:

 docker run -p 9000:15672  -p 1883:1883 -p 5672:5672  cyrilix/rabbitmq-mqtt
 
•	Install Nuclio by running:

docker run -p 8070:8070 -v /var/run/docker.sock:/var/run/docker.sock -v /tmp:/tmp nuclio/dashboard:stable-amd64

•	Create your IFTTT account, create a new Applet with event name mailtrigger, WebHooks in the 'if" section and 'Email' in the then section.

![image](https://user-images.githubusercontent.com/86609798/155203597-a48155a1-632c-46fb-a37c-f72a2666bfa5.png)

 
•	Install required libraries

npm install mqtt

npm install amqplib

npm install request

•	Deploy the sendhealthdata.js function on Nuclio, it will create the queue iot/bloodSugar on RabbitMQ and send a random values for blood Sugar.


Docker containers

![DockerContainer](https://user-images.githubusercontent.com/86609798/155201165-3740c1f8-2b4e-4634-8ca7-1940abf004ac.png)

 
Nuclio

![NuclioPic](https://user-images.githubusercontent.com/86609798/155201283-eb649fa2-b923-42eb-b607-59af8c6318f3.png)


RabbitMQ

![RabitMq](https://user-images.githubusercontent.com/86609798/155201387-b1605ca2-5226-4b72-92c0-4faea13fe851.png)


•	Run the DataLogger.js function, it will start to show all the values published on the queue and their timestamp. 

Logger 

![DataLogger](https://user-images.githubusercontent.com/86609798/155201945-f3c36baa-856b-4e76-b849-d15ee479557f.png)

 
•	Run the bloodSugarmanager.js function to start to read values from the queue iot/bloodSugar and basing on the value found, it will take some actions. If the value is in the safe health range (<140) it will send the value to an app client using mqtt, while if the value is above the safe health range (>140) it will also send an email to the doctor to warn about the patient's health. As application, has been used a general purpose MQTT client for android.
 
IFTTT

![IFTTT](https://user-images.githubusercontent.com/86609798/155201041-d4febfc6-b1db-438a-954d-cf8793d45734.png)

 
MQTIZER

![MQTIZER](https://user-images.githubusercontent.com/86609798/155202033-81133afc-1a04-41a9-947c-61e428a7fbc5.jpg)

Note: in the above mentioned functions you need to change the IP address with your own IP address and the API KEY of the IFTTT function with the APY KEY you will find in Settings after you create your own function.
