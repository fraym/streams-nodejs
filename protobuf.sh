#! /bin/bash
git clone git@github.com:fraym-work/streams-proto.git ./.pb

cd ./.pb

mkdir -p ../src/protobuf
grpc_tools_node_protoc \
  --js_out=import_style=commonjs,binary:../src/protobuf \
  --grpc_out=grpc_js:../src/protobuf \
  clientchannel/*.proto

grpc_tools_node_protoc \
  --plugin=protoc-gen-ts=../node_modules/.bin/protoc-gen-ts \
  --ts_out=grpc_js:../src/protobuf \
  clientchannel/*.proto

cd ..
rm -rf .pb
