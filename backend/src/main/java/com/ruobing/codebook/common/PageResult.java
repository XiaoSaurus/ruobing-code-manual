package com.ruobing.codebook.common;

import lombok.Data;

@Data
public class PageResult<T> {
    private long total;
    private long page;
    private long pageSize;
    private T records;

    public static <T> PageResult<T> of(long total, long page, long pageSize, T records) {
        PageResult<T> result = new PageResult<>();
        result.setTotal(total);
        result.setPage(page);
        result.setPageSize(pageSize);
        result.setRecords(records);
        return result;
    }
}
