#!/bin/bash

jupyter kernelgateway --KernelGatewayApp.allow_origin='*' --KernelGatewayApp.allow_headers='X-XSRFToken,Content-Type' --JupyterWebsocketPersonality.list_kernels=True
