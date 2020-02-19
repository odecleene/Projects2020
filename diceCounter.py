import numpy as np
import math, os, skimage, numpy
from skimage import io, morphology, measure
from skimage.filters import threshold_otsu, unsharp_mask
from skimage.color import rgb2gray
from skimage.measure import label
from matplotlib import pyplot as plt
from skimage import segmentation

# Owen DeCleene
# 10/18/2019
# Dice Counter
# This script processes a JPEG of dice and prints an array
# of numbers representing the dots showing on each die


# processes image for ideal processing conditions
def editImage(image):
    # load image
    im = image
    display(im)
    # image enhancement RGB
    im = unsharp_mask(im, 1.0, 1.0, False, False)
    #display(im)
    # image enhancement gray
    im = rgb2gray(im)
    #display(im)
    im = skimage.exposure.rescale_intensity(im)
    #display(im)
    # image enhancement BW
    thresh = threshold_otsu(im)
    im = im > thresh
    #display(im)
    # morphology enhancement
    se1 = skimage.morphology.selem.disk(4)
    se2 = skimage.morphology.selem.disk(2)
    im = morphology.binary_closing(im, se1)
    im = morphology.binary_opening(im, se2)
    #display(im)
    # remove artifacts on image border
    im = segmentation.clear_border(im)
    return im


# given an image of dice, returns number using base 6 system
def getNumFromImage(image):
    image = editImage(image)
    dotList = dotArray(image)
    print(dotList)
    numDots = baseDots(dotList)
    return numDots


# given a processed image, returns array of dots per die
def dotArray(imageBW):
    imageBW = label(imageBW)
    dots = []
    for region in measure.regionprops(imageBW):
        dotNum = 1 - region.euler_number
        if dotNum != 0:
            dots.append(dotNum)
    return dots


# returns path to random image of dice
def getFile():
    #file = "dicepics/dice" + str(numpy.random.randint(1, 25)) + ".jpg"
    file = "dicepics/dice18.jpg"  # for demo, try 2, 4, 8, 18, 20
    return os.path.join(skimage.data_dir, file)


# given an array of dots per die, returns value of base 6 number
def baseDots(dotList):
    i = 0
    num = 0
    for n in dotList:
        n = n - 1
        num += n * math.pow(6, i)
        i += 1
    return int(num)


def display(image):
    # show image
    io.imshow(image)
    plt.show()


# load image
filename = getFile()
image = io.imread(filename)
print(filename)
getNumFromImage(image)



