from tensorflow import keras
import cv2 as cv
import numpy as np

model = keras.models.load_model('./Age_sex_detection.h5')

def read_image(image_path):
    image=cv.imread(image_path)
    image = cv.cvtColor(image, cv.COLOR_BGR2RGB)
    image= cv.resize(image,(48,48))
    return image

def predict_image(image, Model):
  image_f = np.array([image])/255
  pred_1=Model.predict(image_f)
  print(pred_1)
  sex_f=['Male','Female']
  age=int(np.round(pred_1[1][0]))
  sex=int(np.round(pred_1[0][0]))
  print("Predicted Age: "+ str(age))
  print("Predicted Sex: "+ sex_f[sex])

predict_image(read_image("./data/input/test6.jpg"), model)



