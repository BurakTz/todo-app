# ============================================
# STAGE 1: Build - Maven ile .jar dosyasini derle
# ============================================
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Once sadece pom.xml'i kopyala ve bagimliliklari indir.
# Bu sayede sadece kaynak kod degisirse (pom.xml degismezse),
# Docker'in katman onbellegi (layer cache) sayesinde bagimliliklar
# tekrar tekrar indirilmez - build hizlanir.
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Simdi kaynak kodu kopyala ve derle.
# -DskipTests: image build sirasinda testleri tekrar calistirmiyoruz,
# cunku onlar zaten CI asamasinda (GitHub Actions'ta) calisiyor.
COPY src ./src
RUN mvn clean package -DskipTests -B

# ============================================
# STAGE 2: Run - sadece JRE + derlenmis .jar
# ============================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Guvenlik icin root olmayan bir kullanici olustur ve onunla calistir
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Build asamasindan SADECE derlenmis .jar dosyasini kopyala.
# Maven, kaynak kod, .m2 klasoru gibi hicbir sey bu asamaya gecmiyor.
COPY --from=build /app/target/*.jar app.jar

# Spring Boot varsayilan olarak 8080 portunda calisir
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]