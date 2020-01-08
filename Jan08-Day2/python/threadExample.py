import threading
import time

def print_A(argNaja):
    while True:
        print('A')
        time.sleep(0.7)

def print_B(argNaja):
    while True:
        print('B')
        time.sleep(0.3)

if __name__ == "__main__":
    a = threading.Thread(target=print_A, args=('haha',))
    b = threading.Thread(target=print_B, args=('ha',))
    a.start()
    b.start()