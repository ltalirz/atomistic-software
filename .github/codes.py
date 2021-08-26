# -*- coding: utf-8 -*-
"""Schema and validation of simulation code metadata."""
from dataclasses import dataclass
from enum import Enum
from typing import Dict, Optional, List
from pathlib import Path
from serde import serialize, deserialize, json, yaml

DATA_DIR = Path(__file__).parent.parent / 'src' / 'data'

class QueryMethods(str, Enum):
    """Methods for querying Google Scholar."""
    SEARCH = 'search term'
    PUBLICATION = 'publication'


@deserialize
@serialize
@dataclass
class Code:  # pylint: disable=too-many-instance-attributes
    """Class representing a code.
    
    Optional fields are no longer used by the web application.
    Fields with default values are used by the web application.
    """
    name: str
    benchmarks: List[str]
    homepage: str
    author_name: Optional[str]
    query_method: str
    query_string: str
    types: List[str]
    license: str
    tags: List
    apis: list = ()
    distribution_channels: list = ("Source", )
    nomad_tags: list = None
    query_publication_id: str = None  # has to be str since >32bit
    notes: str = None
    license_annotation: str = None
    element_coverage: str = None
    acceleration: list = None

def read_codes_json(path: Path = DATA_DIR / 'codes.json') -> Dict[str, Code]:
    """Read codes.json file and return dictionary."""

    with open(path) as handle:
        return json.from_json(Dict[str, Code], handle.read())

def write_codes_json(path: Path = DATA_DIR / 'codes.json', codes: Dict[str, Code] = read_codes_json()) -> None:
    """Write codes.json file.
    
    May use if switch to json format is made.
    """

    with open(path, 'w') as handle:
        handle.write(json.to_json(codes, indent=2, sort_keys=True, ensure_ascii=False))

def write_codes_yaml(path: Path = DATA_DIR / 'codes.yaml', codes: Dict[str, Code] = read_codes_json()) -> None:
    """Write codes.yaml file.
    
    May use if switch to yaml format is made.
    """

    with open(path, 'w') as handle:
        handle.write(yaml.to_yaml(codes))

def read_codes_yaml(path: Path = DATA_DIR / 'codes.yaml') -> Dict[str, Code]:
    """Read codes.yaml file and return dictionary.

    May use if switch to yaml format is made.
    """

    with open(path) as handle:
        return yaml.from_yaml(Dict[str, Code], handle.read())

print(read_codes_json())
write_codes_json()