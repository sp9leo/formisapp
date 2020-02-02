# -*- coding: utf-8 -*-
from setuptools import setup, find_packages

with open('requirements.txt') as f:
	install_requires = f.read().strip().split('\n')

# get version from __version__ variable in formis2/__init__.py
from formis2 import __version__ as version

setup(
	name='Formis',
	version=version,
	description='formis new app',
	author='formis',
	author_email='info',
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
