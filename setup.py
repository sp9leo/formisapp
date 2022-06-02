from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in erpcustom/__init__.py
from erpcustom import __version__ as version

setup(
	name="formisapp",
	version=version,
	description="ERP customization",
	author="Formis",
	author_email="info@formis.si",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
