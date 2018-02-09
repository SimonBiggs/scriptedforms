import os
import scriptedforms as sf


def example(name):
    print('Hello {}!'.format(name))

def main():
    here = os.path.dirname(__file__)
    filepath = os.path.join(here, 'simple.md')
    sf.load(filepath)


if __name__ == "__main__":
    main()
