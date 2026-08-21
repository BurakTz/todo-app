package com.buraktz.backend.service;

import com.buraktz.backend.entity.User;
import com.buraktz.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mindrot.jbcrypt.BCrypt;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/**
 * AuthService icin unit testler.
 * UserRepository mock'lanir. JwtService de mock'lanir (gercek JWT uretmiyoruz,
 * sadece "generateToken cagrildi mi, ne dondu" kontrol ediyoruz).
 * BCrypt gercek kutuphane olarak kullanilir (mock'lanmaz) cunku asil test etmek
 * istedigimiz sey AuthService'in BCrypt'i dogru kullanip kullanmadigi.
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    // ---------------------------------------------------------------
    // register
    // ---------------------------------------------------------------

    @Test
    void register_yeniEmailIse_kullaniciyiHashliSifreyleKaydeder() {
        // given: bu email daha once kayitli degil
        when(userRepository.findByEmail("yeni@example.com")).thenReturn(Optional.empty());
        // save cagrildiginda verilen User nesnesini aynen geri dondur
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // when
        User result = authService.register("yeni@example.com", "sifre123");

        // then
        assertThat(result.getEmail()).isEqualTo("yeni@example.com");

        // sifre duz metin olarak saklanmamali
        assertThat(result.getPasswordHash()).isNotEqualTo("sifre123");

        // ama BCrypt.checkpw ile orijinal sifreyle eslesmeli
        assertThat(BCrypt.checkpw("sifre123", result.getPasswordHash())).isTrue();

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_emailZatenKayitliysa_exceptionFirlatirVeKaydetmez() {
        // given: bu email'de zaten bir kullanici var
        User existingUser = new User();
        existingUser.setEmail("var@example.com");
        when(userRepository.findByEmail("var@example.com")).thenReturn(Optional.of(existingUser));

        // when + then
        assertThatThrownBy(() ->
                authService.register("var@example.com", "herhangibirsifre")
        )
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Bu email zaten kayıtlı");

        // email zaten kayitliyken save() hic cagrilmamali
        verify(userRepository, never()).save(any(User.class));
    }

    // ---------------------------------------------------------------
    // login
    // ---------------------------------------------------------------

    @Test
    void login_dogruSifreyle_jwtTokenDoner() {
        // given: kullanici var, sifresi "dogrusifre123" olarak hashlenmis
        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setPasswordHash(BCrypt.hashpw("dogrusifre123", BCrypt.gensalt()));

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        // jwtService mock'landigi icin gercek token uretmiyor, sahte bir string donduruyoruz
        when(jwtService.generateToken(1L)).thenReturn("sahte-jwt-token");

        // when
        String token = authService.login("test@example.com", "dogrusifre123");

        // then
        assertThat(token).isEqualTo("sahte-jwt-token");
        verify(jwtService, times(1)).generateToken(1L);
    }

    @Test
    void login_kullaniciYoksa_exceptionFirlatir() {
        // given
        when(userRepository.findByEmail("yok@example.com")).thenReturn(Optional.empty());

        // when + then
        assertThatThrownBy(() ->
                authService.login("yok@example.com", "herhangibirsifre")
        )
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Kullanıcı bulunamadı");

        // kullanici bulunamadiginda token uretilmeye calisilmamali
        verify(jwtService, never()).generateToken(anyLong());
    }

    @Test
    void login_yanlisSifreyle_exceptionFirlatirVeTokenUretmez() {
        // given: kullanici var ama girilen sifre yanlis
        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setPasswordHash(BCrypt.hashpw("dogrusifre123", BCrypt.gensalt()));

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        // when + then
        assertThatThrownBy(() ->
                authService.login("test@example.com", "yanlissifre")
        )
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Şifre yanlış");

        verify(jwtService, never()).generateToken(anyLong());
    }
}