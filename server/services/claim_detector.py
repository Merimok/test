import json
from typing import List

import openai


def detect_claims(text: str, *, model: str = "gpt-3.5-turbo-0613") -> List[str]:
    """Use OpenAI function-calling API to extract atomic claims from ``text``."""
    functions = [
        {
            "name": "record_claims",
            "description": "Return a list of atomic claims found in the text",
            "parameters": {
                "type": "object",
                "properties": {
                    "claims": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Extracted claims",
                    }
                },
                "required": ["claims"],
            },
        }
    ]

    messages = [
        {
            "role": "system",
            "content": "Extract atomic factual claims from the user's text",
        },
        {"role": "user", "content": text},
    ]

    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        functions=functions,
        function_call={"name": "record_claims"},
    )

    call = response["choices"][0]["message"]["function_call"]
    args = json.loads(call.get("arguments", "{}"))
    claims = args.get("claims", [])
    return claims
