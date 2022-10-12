import psutil
import platform
import os
from dashing import HSplit, VSplit, VGauge, HGauge
from time import sleep



os.system('clear')

ui = HSplit (# ui.items
    HSplit(# ui.items[0]
        VGauge(title='RAM'), # ui.items[0].items[0]
        VGauge(title='SWAP'), # ui.items[0].items[1]
        title='Memória',
        border_color=3
    ),
    VSplit (# ui.items[1]
        VGauge (title='CPU %'),
        title='CPU',
        border_color=5,
    ),
    HSplit (# ui.items[2]
        VGauge (title='DiSCO_USO'),
        title='DISCO',
        border_color=3,
    ),
    
)

print("""

██████╗ ███████╗███╗   ███╗    ██╗   ██╗██╗███╗   ██╗██████╗  ██████╗     ██╗
██╔══██╗██╔════╝████╗ ████║    ██║   ██║██║████╗  ██║██╔══██╗██╔═══██╗    ██║
██████╔╝█████╗  ██╔████╔██║    ██║   ██║██║██╔██╗ ██║██║  ██║██║   ██║    ██║
██╔══██╗██╔══╝  ██║╚██╔╝██║    ╚██╗ ██╔╝██║██║╚██╗██║██║  ██║██║   ██║    ╚═╝
██████╔╝███████╗██║ ╚═╝ ██║     ╚████╔╝ ██║██║ ╚████║██████╔╝╚██████╔╝    ██╗
╚═════╝ ╚══════╝╚═╝     ╚═╝      ╚═══╝  ╚═╝╚═╝  ╚═══╝╚═════╝  ╚═════╝     ╚═╝
                                                                             
""")

print("Nosso programa está disponivel para sua plataforma", platform.system(), platform.release(),
"\n \n Selecione uma opção: \n [1] Monitore os dados\n [2] Sair")


escolha = int(input())

os.system('clear')

if escolha == 1:

 while True:
    # # Memória
    mem_tui = ui.items[0]

    # RAM
    ram_tui = mem_tui.items[0]
    ram_tui.value = psutil.virtual_memory().percent
    ram_tui.title = f'RAM {ram_tui.value} %'

    # SWAPc
    swap_tui = mem_tui.items[1]
    swap_tui.value = psutil.swap_memory().percent
    swap_tui.title = f'SWAP {swap_tui.value} %'

    # # CPU
    cpu_tui = ui.items[1]
    # # CPU %
    cpu_percent_tui = cpu_tui.items[0]
    ps_cpu_percent = psutil.cpu_percent()
    cpu_percent_tui.value = ps_cpu_percent
    cpu_percent_tui.title = f'CPU {ps_cpu_percent}%'

    # # DISCO

    diskT_tui = ui.items[2]

    # # DISCO_USO
    disk_tui = diskT_tui.items[0]
    ps_disk_percent = psutil.disk_usage('/').percent
    disk_tui.value = ps_disk_percent
    disk_tui.title = f'Uso {ps_disk_percent}%'




    try:
        ui.display()

        sleep(5)
    except KeyboardInterrupt:
        break


if escolha == 2:
    exit()
    