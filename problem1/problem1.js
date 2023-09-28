var sum_to_n_a = function (n) {
    // your code here
    // Recursive solution
    return n == 1
        ? 1
        : n + sum_to_n_a(n - 1);
}

var sum_to_n_b = function (n) {
    // your code here
    // Iterative solution
    function helper(n, sum) {
        return n == 0
            ? sum
            : helper(n - 1, sum + n);
    }
    return helper(n, 0);
}

var sum_to_n_c = function (n) {
    // your code here
    // AP sum to n
    return (n / 2) * (2 + (n - 1));
}
