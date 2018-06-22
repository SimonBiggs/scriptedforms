<!-- markdownlint-disable MD033 -->

# A slider

## Edit this form

Open the plain text form file in a new window using the following link:

> [Edit this form](../../edit/a-slider.md)

With this window open, and the edit window open side by side you can see the
effects of changes on the interface.

## Example slider

Using the slider and live sections combined with matplotlib plots you can
produce utilities like the following:

<section-start>

```python
plt.rc('font', size=15)

t = np.linspace(-2*np.pi, 2*np.pi, 500)
omega = np.ones(2)
```

</section-start>

<section-live>

Angular frequencies ($\omega$):

<variable-slider label="$\omega_0$" min="0" max="6" step="0.1">omega[0]</variable-slider>
<variable-slider label="$\omega_1$" min="0" max="6" step="0.1">omega[1]</variable-slider>

```python
plt.figure(figsize=(5*1.618,5))

oscillation = np.sin(t[:, np.newaxis] * omega[np.newaxis, :])
summation = np.sum(oscillation, axis=1)

plt.plot(t, oscillation)
plt.plot(t, summation)

plt.xlim([-2*np.pi, 2*np.pi])
plt.ylim([-2.8, 2.8])
plt.title('Two sin curves and their summation')
plt.legend([
    r'$\omega_0 = {0:0.1f}$'.format(omega[0]),
    r'$\omega_1 = {0:0.1f}$'.format(omega[1]),
    'Summation'], loc='upper right')
plt.xlabel('time (seconds)')
plt.ylabel(r'$sin(\omega \times t)$');
```

</section-live>
