class mySidebar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <ul class="navbar-nav sidebar sidebar-light accordion" id="accordionSidebar">
            <a class="sidebar-brand d-flex align-items-center justify-content-center">
                <div class="sidebar-brand-icon">
                    <img src="../assets/img/LogoAzulEscuro.svg" >
                </div>
                <div class="sidebar-brand-text mx-3">AIR-DATA</div>
            </a>
            <hr class="sidebar-divider my-0">
            <li class="nav-item">
                <a id="painel-link" class="nav-link" href="./painel.html">
                    <i class="fas fa-fw fa-tachometer-alt"></i>
                    <span>Painel Geral</span></a>
                    <hr class="sidebar-divider">
            </li>
            <li class="nav-item">
                
                <a id="alerta-link" class="nav-link" href="./alertas.html">
                    <i class="bi bi-bell-fill"></i>
                    <span style="font-size:1rem">Alertas</span></a>
                    
            </li>
            
            <hr class="sidebar-divider">

            <li class="nav-item">
                
                <a id="maquina-link" class="nav-link" href="./maquinas.html">
                    <i class="bi bi-hdd-rack-fill"></i>
                    <span style="font-size:1rem">Máquinas</span></a>
                    
            </li>

            <hr class="sidebar-divider">

            <li class="nav-item">
                
                <a id="usuario-link" class="nav-link" href="./usuarios.html">
                    <i class="bi bi-people-fill"></i>
                    <span style="font-size:1rem">Usuários</span></a>
                    
            </li>
            
        </ul>
        
        `
    }
}

class myTopbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <nav class="navbar container-fluid navbar-expand navbar-light bg-navbar topbar mb-4 static-top navbar-edit">
            <button id="sidebarToggleTop" class="btn btn-link rounded-circle mr-3">
                <i class="fa fa-bars"></i>
            </button>
            <ul class="navbar-nav ml-auto">
                <li class="nav-item dropdown no-arrow">
                    <a class="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fas fa-search fa-fw"></i>
                    </a>
                    <div class="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in" aria-labelledby="searchDropdown">
                        <form class="navbar-search">
                            <div class="input-group">
                                <input type="text" class="form-control bg-light border-1 small" placeholder="What do you want to look for?" aria-label="Search" aria-describedby="basic-addon2" style="border-color: #3f51b5;">
                                <div class="input-group-append">
                                    <button class="btn btn-primary" type="button">
                                        <i class="fas fa-search fa-sm"></i>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </li>

                <li class="nav-item dropdown no-arrow mx-1">

                </li>
                <div class="topbar-divider d-none d-sm-block"></div>
                    <li class="nav-item dropdown no-arrow">
                        <a id="area_user" class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                            <img class="img-profile rounded-circle" src="../assets/img/boy.jpg" style="max-width: 60px">
                            <span class="ml-2 d-none d-lg-inline text-white small span_userName" id="username"> USUARIO </span>
                        </a>
                        <div id="dropdownUser" class="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                            <a class="dropdown-item" href="#">
                                <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                Perfil
                            </a>
                            <a class="dropdown-item" href="#">
                                <i class="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                                Configurações
                            </a>
                            <a class="dropdown-item" href="#">
                                <i class="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                                Atividades
                            </a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="../sing-in.html" data-toggle="modal" data-target="#logoutModal">
                                <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                Sair
                            </a>
                        </div>
                    </li>
            </ul>
        </nav>

        `
    }
}

customElements.define('my-sidebar', mySidebar);
customElements.define('my-topbar', myTopbar);