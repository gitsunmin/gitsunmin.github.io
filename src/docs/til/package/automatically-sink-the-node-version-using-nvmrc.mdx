# Automatically sink the node version using .nvmrc

`.nvmrc`라는 파일을 이용하여 버전을 정의하면, `nvm use` 명령어를 실행하여 node 버전을 프로젝트에 맞게 쉽게 변경이 가능합니다.

그렇다면, 디렉토리 내에 `.nvmrc`파일이 있는 경우에 자동으로 `nvm use`를 실행 시켜주는 스크립트가 있으면 얼마나 좋을까요.

그래서 만들었습니다.

참고로 저는 `zsh`를 사용하고 있고 `mac` 환경에서 테스트 해 보았습니다.

```shell
# ~/.zshrc

# Add this to the end of the file
autoload -U add-zsh-hook
load-nvmrc() {
  local node_version="$(nvm version)"
  local nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$node_version" ]; then
      nvm use
    fi
  elif [ "$node_version" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc

```

이 스크립트는 새 터미널 세션을 시작할 때와 디렉토리를 변경할 때마다 실행됩니다. 디렉토리에 `.nvmrc` 파일이 있는 경우, 해당 파일에서 지정한 Node.js 버전을 사용하도록 `nvm use`를 실행합니다. `.nvmrc` 파일이 없는 경우, 기본 Node.js 버전을 사용하도록 설정합니다.

이 설정을 적용하려면 위의 코드를 `~/.zshrc` 파일의 맨 아래에 추가한 후 파일을 저장하고 닫습니다. 그리고 기존 command창을 껐다가 키는 방법 혹은 아래 명령어를 실행합니다.

```shell
source ~/.zshrc
```