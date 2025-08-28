from ollama_ocr import OCRProcessor

# Initialize OCR processor
ocr = OCRProcessor(model_name='llama3.2-vision:11b')  # You can use any vision model available on Ollama
# you can pass your custom ollama api

# Process an image
result = ocr.process_image(
    image_path="/Users/samszo/Sites/freloche/files/Photos-1-001/PXL_20250225_075552954.MP.jpg", # path to your pdf files "path/to/your/file.pdf"
    format_type="markdown",  # Options: markdown, text, json, structured, key_value
    custom_prompt="Extract all text, focusing on names or book title. Search ISBN number for each book.", # Optional custom prompt
    language="French" # Specify the language of the text (New! 🆕)
)
print(result)