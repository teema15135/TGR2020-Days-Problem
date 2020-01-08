import paho.mqtt.client as mqtt
import time
import socket
import json
from datetime import datetime

id = 'KujoCSV'
#           3                       18                  21                  36
mac = ['80:E1:26:07:C8:7B', '80:E1:26:07:CA:DC', '80:E1:26:07:E8:68', '80:E1:26:00:B4:29']
topic = [('/tgr2020/jan08/data/3', 1), ('/tgr2020/jan08/data/18', 1), ('/tgr2020/jan08/data/21', 1), ('/tgr2020/jan08/data/36', 1)]

def on_connect(client, userdata, flags, rc):
    client.subscribe(topic)
    print('Subscribed')
    
def on_message(client, userdata, msg):
    try:
        val = json.loads(msg.payload.decode())
        mac_addr = val.get('mac_addr')
        rssi = str(val.get('rssi'))

        if mac_addr == mac[0]:
            rssiArr = [rssi,'','','']
        elif mac_addr == mac[1]:
            rssiArr = ['',rssi,'','']
        elif mac_addr == mac[2]:
            rssiArr = ['','',rssi,'']
        elif mac_addr == mac[3]:
            rssiArr = ['','','',rssi]
        else:
            None
        
        if msg.topic == topic[0][0]:
            pos = ',topright'
        elif msg.topic == topic[1][0]:
            pos = ',topleft'
        elif msg.topic == topic[2][0]:
            pos = ',bottomright'
        elif msg.topic == topic[3][0]:
            pos = ',bottomleft'
        else:
            None

        appendStr = '\n' + ','.join(rssiArr) + pos + ',"'+ str(datetime.utcnow()) + '"'
        f = open("../csv/data.csv", "a+")
        f.write(appendStr)
        f.close()

        print(val.get('rssi'))
        print(msg.topic, ':', msg.payload)
    except Exception as e:
        print(e)

def on_disconnect(client, userdata, rc):
    print(userdata)
    
print(topic[0][0])
print(topic[1][0])

client = mqtt.Client(client_id=id)
client.connect('202.139.192.75')
client.on_connect = on_connect
client.on_message = on_message
client.on_disconnect = on_disconnect
client.socket().setsockopt(socket.SOL_SOCKET, socket.SO_SNDBUF, 2048)
client.loop_forever()

while True:
    time.sleep(10)
    print('Waiting')