from time import sleep
from bleak import discover
import paho.mqtt.client as mqtt
import json

import threading

topic = '/tgr2002/jan08/data/22'

queue = []

def scan(mac_addrs):
    while True:
        print('Start scanning')
        devices = descover() # removed await
        print('Found %d devices'%(len(devices)))
        for dev in devices:
            dev_mac = str(dev).split(': ')[0]
            if dev_mac in mac_addrs:
                print(dev_mac, 'detected at', dev.rssi, 'dBm')
                queue.append({'mac_addr':dev_mac, 'rssi':dev.rssi})
        sleep(10) # was "await asyncio.sleep"

def on_connect(client, userdata, flags, rc):
    print('MQTT connected')
    
def on_message(client, userdata, msg):
    print(msg.payload)

def on_disconnect(client, userdata, rc):
    print(userdata)

def publish():
    client = mqtt.Client(client_id='Jotaro')
    client.connect('202.139.192.75')
    client.on_connect = on_connect
    client.on_message = on_message
    client.on_disconnect = on_disconnect
    client.loop_start()
    print('Start MQTT publisher')
    while True:
        while len(queue) == 0:
            print('waiting for queue')
            sleep(1)
        print('Forwarding', 'Hello world')
        client.publish(topic, json.dumps(queue.pop(0)), qos=1)
        sleep(1)
    mqtt.loop_stop()

if __name__ == '__main__':
    mac_addrs = ("80:E1:26:07:C8:FB", "80:E1:26:00:66:5F", "80:E1:26:00:62:97")
    scanThread = threading.Thread(target=scan, args=(mac_addrs,))
    publishThread = threading.Thread(target=publish)
    scanThread.start()
    publishThread.start()