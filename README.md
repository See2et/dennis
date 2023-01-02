# dennis

A tennis game on a terminal, made with [Deno](https://deno.land).

## install

```
deno install --allow-read --force https://raw.githubusercontent.com/See2et/dennis/main/dennis.ts
```

## usage

```
dennis
```

## options

- `--version` `-V`
  - Show a version.

## troubleshoot

- Dennis throws an error.
  - try do it.

    ```
    $ deno info https://raw.githubusercontent.com/See2et/dennis/main/dennis.ts

    local: /Users/[user name]/Library/Caches/deno/deps/https/raw.githubusercontent.com/301c1e07817799ace3d80a7ea046d3b551c95a7294d0f767ee6c80c2884822c3
    ...
    ```

    Then copy
    `/Users/[user name]/Library/Caches/deno/deps/https/raw.githubusercontent.com/`,
    and do `rm [dirname which you copied] -rf`. It means deleting cache about
    dennis.
