from diffusers import DiffusionPipeline
import torch

pipe = DiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-xl-base-1.0", torch_dtype=torch.float16, use_safetensors=True, variant="fp16")
pipe.to("cuda")

def generateImage(prompt, filename):
    images = pipe(prompt=prompt).images[0]
    images.save(filename)
    return filename
