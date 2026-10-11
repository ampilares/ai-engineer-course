# Module 4: Deep learning in practice

**Time:** 3 weeks

**Outcome:** Train and diagnose a neural network, understand backpropagation, and deploy a small inference demo.

## Learn

- Tensors, parameters, layers, activations, loss functions, gradient descent, backpropagation, and optimizers.
- Batches, epochs, learning rates, initialization, normalization, regularization, augmentation, and transfer learning.
- Embeddings and learned representations.
- CNNs, sequence models, and the bridge from neural networks to transformers.
- GPU/CPU memory, training vs. inference, checkpoints, reproducibility, and experiment tracking.
- Error analysis, data-centric improvement, and responsible dataset use.

## Core resources

- [Practical Deep Learning for Coders](https://course.fast.ai/): free applied course and book.
- [Neural Networks: Zero to Hero](https://karpathy.ai/zero-to-hero.html): build neural networks and a GPT-style model from scratch.
- [MIT OpenCourseWare: Deep Learning](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/): lectures, notes, and assignments.
- [PyTorch tutorials](https://pytorch.org/tutorials/): primary framework reference.
- [3Blue1Brown neural networks series](https://www.3blue1brown.com/topics/neural-networks): visual intuition.

## Labs

1. Implement a scalar autograd engine or follow Karpathy’s micrograd exercise.
2. Train an image or text classifier using transfer learning.
3. Plot training/validation loss; diagnose underfitting, overfitting, or data issues.
4. Perform structured error analysis and improve one data/model variable.
5. Export an inference function and build a small Gradio or FastAPI demo.

## Project acceptance

- seed/configuration and data split are recorded;
- a non-neural baseline is included where sensible;
- curves and example-level errors support the diagnosis;
- inference handles invalid input;
- the model artifact has provenance and limitations;
- the learner explains a forward pass and backpropagation without equations alone.

## Stretch

Reimplement the model in raw PyTorch after using a high-level library. Profile memory and latency by batch size and precision.
