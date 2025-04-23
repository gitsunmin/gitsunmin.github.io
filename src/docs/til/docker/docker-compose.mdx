# Docker Componse

`Docker Compose`는 멀티 컨테이너 Docker 애플리케이션을 정의하고 실행하기 위한 도구입니다. `Docker Compose`를 사용하면 YAML 파일을 사용하여 애플리케이션의 서비스를 구성할 수 있습니다. 그런 다음 명령 한 번으로 구성에서 모든 서비스를 생성하고 시작할 수 있습니다.

이러한 `Docker Compose`는 아래와 같은 기능을 가지고 있습니다.

- 단일 호스트에 여러 개의 격리된 환경 보유
- 컨테이너 생성 시 볼륨 데이터 보존
- 변경된 컨테이너만 다시 생성
- 환경 간 변수 및 컴포지션 이동 지원

# 예시

아래는 `Docker Compose`를 사용하여 `Wordpress`를 실행하는 예시입니다.

```yaml
version: '3.3',

services:
  db:
    image: mysql:5.7
    volumes:
      - db_data:/var/lib/mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: wordpress
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress

  wordpress:
    depends_on:
      - db
    image: wordpress:latest
    ports:
      - "8000:80"
    restart: always
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress
volumes:
    db_data:
```

이렇게 만들어진 yaml 파일을 `docker-compose up` 명령어를 통해 실행할 수 있습니다.

```shel
// 시작
$ docker-compose up

// 백그라운드에서 실행 가능
docker-compose up -d

// 종료
$ docker-compose down
```

참고로 위의 docker-compose.yml 파일은 볼륨, 네트워크, 컨테이너 등을 생성할 수 있기 때문에, 프론트엔드에서도 개발전용 환경이 필요할 경우에는 유용하게 사용할 수 있습니다.