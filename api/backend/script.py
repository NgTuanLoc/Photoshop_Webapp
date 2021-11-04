# import các thư viện cần dùng
import tensorflow.compat.v1 as tf
tf.disable_v2_behavior()

from ultils import load_class_names, load_images, load_weights, draw_boxes
from model.model import Yolo_v3

_MODEL_SIZE = (416, 416)

def object_detection(image_path):
    batch_size = len(image_path)
    batch = load_images(image_path, model_size=_MODEL_SIZE)
    class_names = load_class_names('./coco.names')
    n_classes = len(class_names)
    max_output_size = 10
    iou_threshold = 0.5
    confidence_threshold = 0.5

    model = Yolo_v3(n_classes=n_classes, model_size=_MODEL_SIZE,
                    max_output_size=max_output_size,
                    iou_threshold=iou_threshold,
                    confidence_threshold=confidence_threshold)

    inputs = tf.placeholder(tf.float32, [batch_size, 416, 416, 3])

    detections = model(inputs, training=False)

    model_vars = tf.global_variables(scope='yolo_v3_model')
    assign_ops = load_weights(model_vars, './model/yolov3.weights')

    with tf.Session() as sess:
        sess.run(assign_ops)
        detection_result = sess.run(detections, feed_dict={inputs: batch})
        
    draw_boxes(image_path, detection_result, class_names, _MODEL_SIZE)

