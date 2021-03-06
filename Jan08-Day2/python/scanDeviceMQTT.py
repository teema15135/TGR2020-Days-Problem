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
        print('before discover')
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

async def publish(queue):
    client = mqtt.Client(client_id='Jotaro')
    client.connect('202.139.192.75')
    client.on_connect = on_connect
    client.on_message = on_message
    client.on_disconnect = on_disconnect
    client.loop_start()
    print('Start MQTT publisher')
    while True:
        val = await queue.get()
        print('Forwarding', val)
        client.publish(topic, json.dumps(val), qos=1)
        await asyncio.sleep(1)
    mqtt.loop_stop()

if __name__ == '__main__':
    # mac_addrs = ('80:E1:26:07:C8:FB', '80:E1:26:00:66:5F', '80:E1:26:00:62:97')
    #               3                   18                      21                      36
    mac_addrs = ('80:E1:26:07:C8:7B', '80:E1:26:07:CA:DC', '80:E1:26:07:E8:68', '80:E1:26:00:B4:29')
    loop = asyncio.get_event_loop()
    queue = asyncio.Queue()
    loop.create_task(scan(mac_addrs, queue))
    loop.create_task(publish(queue))
    print('before run forever')
    try:
        loop.run_forever()
    except KeyboardInterrupt:
        loop.close()
        print('Program stopped')