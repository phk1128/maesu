plugins {
    kotlin("jvm") version "2.2.21"
    kotlin("plugin.spring") version "2.2.21"
    id("org.springframework.boot") version "4.0.6"
    id("io.spring.dependency-management") version "1.1.7"
    kotlin("plugin.jpa") version "2.2.21"
    checkstyle
}

group = "com.colosseum"
version = "0.0.1-SNAPSHOT"
description = "backend"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

repositories {
    mavenCentral()
}


dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-webmvc")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-oauth2-resource-server")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("tools.jackson.module:jackson-module-kotlin")
    compileOnly("org.projectlombok:lombok")
    runtimeOnly("org.postgresql:postgresql")
    annotationProcessor("org.projectlombok:lombok")
    testImplementation("org.springframework.boot:spring-boot-starter-data-jpa-test")
    testImplementation("org.springframework.boot:spring-boot-starter-webmvc-test")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
    testCompileOnly("org.projectlombok:lombok")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
    testAnnotationProcessor("org.projectlombok:lombok")
}


kotlin {
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict", "-Xannotation-default-target=param-property")
    }
}

allOpen {
    annotation("jakarta.persistence.Entity")
    annotation("jakarta.persistence.MappedSuperclass")
    annotation("jakarta.persistence.Embeddable")
}

checkstyle {
    toolVersion = "10.25.0"
    configFile = file("config/checkstyle/checkstyle.xml")
}

tasks.withType<Test> {
    useJUnitPlatform()
}

// application.yml은 git에 올리지 않고 서브모듈(maesu-submodule/env)에서 관리한다.
// 빌드 시 서브모듈에서 src/main/resources로 복사한 뒤 리소스 처리한다.
val envSource = file("../maesu-submodule/env/application.yml")

val copyEnv by tasks.registering(Copy::class) {
    description = "서브모듈 env에서 application.yml을 복사한다 (git 미추적)"
    group = "build setup"
    doFirst {
        if (!envSource.exists()) {
            throw GradleException(
                "application.yml을 찾을 수 없습니다: ${envSource.path}\n" +
                    "서브모듈을 초기화하세요: git submodule update --init",
            )
        }
    }
    from(envSource)
    into(layout.projectDirectory.dir("src/main/resources"))
}

tasks.named("processResources") {
    dependsOn(copyEnv)
}
