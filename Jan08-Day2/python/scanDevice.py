import asyncio
from time import sleep
from bleak import discover

async def scan(mac_addrs):
    while True:
        print('Start scanning')
        tstart = loop.time()
        devices = await discover()
        print('Found %d devices'%(len(devices)))
        for dev in devices:
            dev_mac = str(dev).split(': ')[0]
            if dev_mac in mac_addrs:
                print(dev_mac, 'detected at', dev.rssi, 'dBm')
        telapsed = loop.time() - tstart
        print('Elapsed time: %.1f'%(telapsed))
        await asyncio.sleep(10 - telapsed)

if __name__ == '__main__':
    mac_addrs = ("80:E1:26:07:C8:FB", "80:E1:26:00:66:5F", "80:E1:26:00:62:97", "80:E1:26:07:E8:68")
    loop = asyncio.get_event_loop()
    loop.create_task(scan(mac_addrs))
    try:
        loop.run_forever()
    except KeyboardInterrupt:
        loop.close()
        print('Program stopped')