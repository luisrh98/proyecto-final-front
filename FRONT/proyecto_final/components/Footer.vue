<template>
    <footer class="footer">
      <div class="footer-section">
        <h4>Ayuda</h4>
        <a href="#">Contacto</a>
        <a href="#">FAQ</a>
      </div>
      <div class="footer-section">
        <h4>Síguenos</h4>
        <div class="social-icons">
          <i class="fab fa-facebook"></i>
          <i class="fab fa-instagram"></i>
          <i class="fab fa-twitter"></i>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  // Este componente no necesita lógica adicional, ya que es estático.
  </script>
  
  <style lang="scss" scoped>
  @import '../assets/scss/_variables.scss';
  
  .footer {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
    padding: 25px;
    background: $secondary;
    color: $white;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    width: 100%;
  
    .footer-section {
      h4 {
        margin-bottom: 15px;
        font-family: $font-display;
      }
  
      a {
        color: rgba($white, 0.8);
        text-decoration: none;
        margin: 5px 0;
        display: block;
  
        &:hover {
          text-decoration: underline;
        }
      }
  
      .social-icons {
        display: flex;
        gap: 15px;
        font-size: 1.2rem;
      }
    }
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .footer {
      grid-template-columns: 1fr; /* Ajuste para móviles */
    }
  }
  </style>