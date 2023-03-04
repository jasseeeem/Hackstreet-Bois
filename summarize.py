import torch
from transformers import pipeline
import newspaper
import math
from tqdm import tqdm

def writeSummary(links):
    device = torch.device("cuda")
    summarizer = pipeline("summarization", device=device)
    
    contents = []
    for link in links:
        try:
            article = newspaper.Article(link)
            article.download()
            article.parse()
            paras = []
            for para in article.text.split("\n\n"):
                if para.endswith('.'):
                    paras.append(para)
            if len(paras) != 0:
                contents.append(paras)
        except:
            None

    PROPORTION = 0.2

    sublist_proportions = [math.ceil(len(sublist) * PROPORTION) for sublist in contents]
    combined_lists = []

    for i in range(int(1/PROPORTION)):
        combined_list = []
        for j, list_ in enumerate(contents):
            start = i * sublist_proportions[j]
            end = start + sublist_proportions[j]
            combined_list.append(list_[start:end])
        combined_lists.append(combined_list)

    combined_content = [item for sublist in combined_lists for subsublist in sublist for item in subsublist]
    content_text = ' '.join(combined_content)
    # split the text into smaller chunks
    chunk_size = 512 * 8
    chunks = [content_text[i:i+chunk_size] for i in range(0, len(content_text), chunk_size)]

    # summarize each chunk and concatenate the results
    summary = ""
    for chunk in tqdm(chunks):
        input_ids = summarizer.tokenizer.encode(chunk, return_tensors="pt").to(device)
        output = summarizer.model.generate(input_ids, max_length=1000)
        result = summarizer.tokenizer.decode(output[0], skip_special_tokens=True)
        summary += result + " "

    final_summary = ""
    for sentence in summary.split(". "):
        if len(sentence) > 1:
            final_summary += sentence[0].upper() + sentence[1:] + ". "
    
    return final_summary
