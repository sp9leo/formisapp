# -*- coding: utf-8 -*-
from setuptools import setup, find_packages

with open('requirements.txt') as f:
	install_requires = f.read().strip().split('\n')

# get version from __version__ variable in formisapp/__init__.py
from formisapp import __version__ as version

setup(
	name='formisapp',
	version=version,
	description='Formis new app 2020',
	author='Formis',
	author_email='formis',
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
