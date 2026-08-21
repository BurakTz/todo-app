package com.buraktz.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.postgresql.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * Bu test, Spring Boot'un gercek Application Context'inin (tum @Service,
 * @Repository, @Controller siniflarinin) hatasiz yuklendigini dogruluyor.
 *
 * .env dosyasindaki (ya da Azure'daki) gercek DB'ye BAGLANMIYORUZ.
 * Testcontainers, bu test calisirken kendi Docker'i uzerinde
 * (local'de senin Docker'in, CI'da GitHub Actions'in kendi Docker'i)
 * gecici, bos bir PostgreSQL container'i aciyor.
 *
 * Not: @ServiceConnection burada KULLANILMIYOR, cunku application.properties'te
 * zaten "spring.datasource.url=${DB_URL}" tanimli oldugu icin Spring bu property'yi
 * "kullanici elle ayarlamis" sayiyor ve @ServiceConnection'in otomatik sagladigi
 * baglantiyi gormezden geliyor. Bunun yerine @DynamicPropertySource ile
 * spring.datasource.* degerlerini ELLE, en yuksek onceliklerle, container'in
 * gercek bilgileriyle override ediyoruz - boylece ${DB_URL} ne olursa olsun
 * (bos, .env yok, farketmez) bizim verdigimiz deger kazaniyor.
 */
@Testcontainers
@SpringBootTest
class BackendApplicationTests {

    @Container
    static PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:16");

    @DynamicPropertySource
    static void overrideDatasourceProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        // JWT_SECRET de .env'den gelmiyor CI'da - test icin sabit, guvenli bir deger veriyoruz
        registry.add("jwt.secret", () -> "test-only-secret-key-not-used-in-production-32chars");
    }

    @Test
    void contextLoads() {
    }

}