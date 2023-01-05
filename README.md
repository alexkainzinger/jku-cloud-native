# Domains of applications

- production: [http://production.localhost](http://production.localhost)
- staging: [http://staging.localhost](http://staging.localhost)
  
Note: The domains are configured in the `/etc/hosts` file, so both domains are pointing to `127.0.0.1`

# How to retrieve the password for ArgoCD initial admin user:

```
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
```