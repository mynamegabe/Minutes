from diffusers import DiffusionPipeline
import torch

pipe = DiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-xl-base-1.0", torch_dtype=torch.float16, use_safetensors=True, variant="fp16")
pipe.to("cuda")

# if using torch < 2.0
# pipe.enable_xformers_memory_efficient_attention()

prompt = "Vector of a notebook with robotic elements and clear background"

images = pipe(prompt=prompt).images[0]

images.save("output.png")

prompt = "A white dog chasing a black dog in a circle"

images = pipe(prompt=prompt).images[0]

images.save("output2.png")

