import asyncio
from time import sleep
from bleak import discover
import paho.mqtt.client as mqtt
import json

topic = '/tgr2020/jan08/data/21'

async def scan(mac_addrs, queue):
    while True:
        print('Start scanning')
        tstart = loop.time()
        devices = await discover()
        print('Found %d devices'%(len(devices)))
        for dev in devices:
            dev_mac = str(dev).split(': ')[0]
            if dev_mac in mac_addrs:
                print(dev_mac, 'detected at', dev.rssi, 'dBm')
                queue.put_nowait({'mac_addr':dev_mac, 'rssi':dev.rssi})
        telapsed = loop.time() - tstart
        print('Elapsed time: %.1f'%(telapsed))
        await asyncio.sleep(10 - telapsed)

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
        # val = await queue.get()
        val = "haha"
        print('Forwarding', val)
        client.publish(topic, json.dumps(val), qos=1)
        sleep(1)
    mqtt.loop_stop()

if __name__ == '__main__':
    mac_addrs = ('JOJO!')
    publish()
    try:
        loop.run_forever()
    except KeyboardInterrupt:
        loop.close()
        print('Program stopped')