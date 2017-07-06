#!/bin/bash

jupyter kernelgateway --KernelGatewayApp.allow_origin='http://localhost:5000' --KernelGatewayApp.allow_headers='X-XSRFToken,Content-Type' --JupyterWebsocketPersonality.list_kernels=True
