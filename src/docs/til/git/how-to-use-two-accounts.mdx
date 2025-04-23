# How to use two accounts
이 글에서는 하나의 컴퓨터에서 두 개의 git 계정을 사용하는 방법에 대해 알아보겠습니다.

## Step 1: .gitconfig 파일 수정
Root의 .gitconfig 파일을 수정합니다.
```bash
$ cd
$ vi .gitconfig
```

아래와 같이 수정합니다.
```bash
# .gitconfig

[includeIf "gitdir:~/workspace/my/"]
    path = ~/.gitconfig-my
[includeIf "gitdir:~/workspace/work/"]
    path = ~/.gitconfig-work
```

## Step 2: .gitconfig-my, .gitconfig-work 파일 생성

```bash
$ cd
$ vi .gitconfig-my
```

아래와 같이 생성 또는 수정합니다.
```bash
# .gitconfig-my
[user]
    name = myname
    email = myemail@email.com
```

```bash
$ cd
$ vi .gitconfig-work
```

아래와 같이 생성 또는 수정합니다.
```bash
# .gitconfig-work
[user]
    name = workname
    email = workingemail@email.com
```

## Step 3: 확인하기

```bash
$ cd ~/workspace/my

$ mkdir test
$ cd test
$ git init
$ git config -l

user.name=myname
user.email=myname@email.com
...
```

```bash
$ cd ~/workspace/work

$ mkdir test
$ cd test
$ git init
$ git config -l

user.name=workname
user.email=workingemail@email.com
...
```

지금까지의 절차만으로도 사용이 가능하지만, 보통 회사의 프로젝트에서는 비공개 저장소를 사용하기 때문에, 아래와 같이 추가적인 절차가 필요합니다.

## Step 4: SSH key 분기

이미 각 저장소별로 생성된 ssh가 있다고 가정한 뒤에 분기 되는 방법을 설명하겠습니다.

Root의 .ssh/config 파일을 수정합니다.
```bash
$ cd
$ vi .ssh/config
```

아래와 같이 수정합니다.
```bash
# .ssh/config
Host github.com-my
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa_my

Host github.com-work
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa_work
```

이렇게 설정하고 private 저장소를 ssh로 인증하여 사용할 수 있습니다.
